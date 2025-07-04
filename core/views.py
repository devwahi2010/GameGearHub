from rest_framework import status, generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from .models import Device, RentalRequest, Chat
from .serializers import (
    LoginSerializer, RegisterSerializer,
    DeviceSerializer, RentalRequestSerializer, ChatSerializer
)

import logging
logger = logging.getLogger(__name__)

User = get_user_model()

# --------------------------
# LOGIN
# --------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# --------------------------
# REGISTER
# --------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# --------------------------
# PROFILE
# --------------------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "full_name": user.full_name
        })


# --------------------------
# LOGOUT
# --------------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# DEVICE VIEWS
# --------------------------
class DeviceListCreateView(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


class DeviceDetailView(generics.RetrieveAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}


class AllDevicesView(generics.ListAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Device.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}


# --------------------------
# RENTAL VIEWS
# --------------------------
class CreateRentalRequestView(generics.CreateAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        renter = self.request.user
        device_id = self.kwargs.get('device_id')  # from URL
        device = Device.objects.get(pk=device_id)
        start = serializer.validated_data['start_date']
        end = serializer.validated_data['end_date']

        if start >= end:
            raise ValidationError("⚠️ End date must be after start date.")

        conflict_exists = RentalRequest.objects.filter(
            device=device,
            approved=True,
            start_date__lt=end,
            end_date__gt=start
        ).exists()

        if conflict_exists:
            raise ValidationError("⚠️ This device is already booked for the selected dates.")

        serializer.save(renter=renter, device=device)


class MyRentalsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(renter=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


class ManageRequestsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(device__owner=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


class ApproveRejectRentalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, action):
        try:
            req = RentalRequest.objects.get(pk=pk, device__owner=request.user)
        except RentalRequest.DoesNotExist:
            return Response({'detail': 'Request not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

        if action == 'approve':
            req.approved = True
        elif action == 'reject':
            req.approved = False
        else:
            return Response({'detail': 'Invalid action. Use "approve" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)

        req.save()
        return Response({'detail': f'Request {"approved" if req.approved else "rejected"}'})

# --------------------------
# CHAT
# --------------------------
class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        request_id = self.kwargs['request_id']
        rental_request = get_object_or_404(RentalRequest, id=request_id)
        user = self.request.user

        if rental_request.renter != user and rental_request.device.owner != user:
            raise serializers.ValidationError("🚫 You are not authorized to view this chat.")

        return Chat.objects.filter(request=rental_request).order_by('timestamp')

    def perform_create(self, serializer):
        request_id = self.kwargs['request_id']
        rental_request = get_object_or_404(RentalRequest, id=request_id)
        user = self.request.user

        if rental_request.renter != user and rental_request.device.owner != user:
            raise serializers.ValidationError("🚫 You are not authorized to send messages on this request.")

        serializer.save(sender=user, request=rental_request)

    def get_serializer_context(self):
        return {'request': self.request}
# --------------------------
# OWNER PROFILE
# --------------------------
class OwnerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, owner_id):
        try:
            owner = User.objects.get(pk=owner_id)
            devices = Device.objects.filter(owner=owner)
            device_data = DeviceSerializer(devices, many=True, context={'request': request}).data
            return Response({
                "email": owner.email,
                "full_name": owner.full_name,
                "devices": device_data
            })
        except User.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)