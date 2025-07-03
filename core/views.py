from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .models import Device
from .serializers import LoginSerializer, DeviceSerializer
from rest_framework import serializers
from .models import RentalRequest
from .serializers import RentalRequestSerializer
from .models import Chat
from .serializers import ChatSerializer
from django.db.models import Q
from rest_framework.exceptions import ValidationError

User = get_user_model()

# ------------------------------
# LOGIN VIEW
# ------------------------------
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


# ------------------------------
# REGISTER VIEW
# ------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', '')
        )

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# ------------------------------
# PROFILE VIEW
# ------------------------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "full_name": user.full_name
        })


# ------------------------------
# LOGOUT VIEW
# ------------------------------
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


# ------------------------------
# DEVICE VIEWS
# ------------------------------

# ✅ List and create only the logged-in user's devices
class DeviceListCreateView(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

# ✅ View any single device in detail
class DeviceDetailView(generics.RetrieveAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}
    
# Create rental request


class CreateRentalRequestView(generics.CreateAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        renter = self.request.user
        device = serializer.validated_data['device']
        start = serializer.validated_data['start_date']
        end = serializer.validated_data['end_date']

        # ✅ Check that start_date is before end_date
        if start >= end:
            raise ValidationError("⚠️ End date must be after start date.")

        # ✅ Check for overlapping approved rentals
        conflict_exists = RentalRequest.objects.filter(
            device=device,
            approved=True,
            start_date__lt=end,
            end_date__gt=start
        ).exists()

        if conflict_exists:
            raise ValidationError("⚠️ This device is already booked for the selected dates.")

        serializer.save(renter=renter)
# List my rental requests (I am the renter)
class MyRentalsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(renter=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request}

# List rental requests for my devices (I am the owner)
class ManageRequestsView(generics.ListAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RentalRequest.objects.filter(device__owner=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request}

# Approve/Reject rental request
class ApproveRejectRentalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            req = RentalRequest.objects.get(pk=pk, device__owner=request.user)
        except RentalRequest.DoesNotExist:
            return Response({'detail': 'Request not found or unauthorized'}, status=404)

        approved = request.data.get('approved', None)
        if approved is None:
            return Response({'detail': 'Missing approved field (true/false)'}, status=400)

        req.approved = approved
        req.save()
        return Response({'detail': f'Request {"approved" if approved else "rejected"}'})
    
class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        request_id = self.kwargs['request_id']
        rental_request = get_object_or_404(RentalRequest, id=request_id)
        user = self.request.user

        if rental_request.renter != user and rental_request.device.owner != user:
            return Chat.objects.none()

        return Chat.objects.filter(request=rental_request)

    def perform_create(self, serializer):
        request_id = self.kwargs['request_id']
        rental_request = get_object_or_404(RentalRequest, id=request_id)
        user = self.request.user

        # Authorization check
        if rental_request.renter != user and rental_request.device.owner != user:
            raise serializers.ValidationError("Not authorized to chat on this request.")

        serializer.save(sender=user, request=rental_request)

class OwnerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, owner_id):
        try:
            owner = User.objects.get(pk=owner_id)
            devices = Device.objects.filter(owner=owner)
            device_data = DeviceSerializer(devices, many=True).data
            return Response({
                "email": owner.email,
                "full_name": owner.full_name,
                "devices": device_data
            })
        except User.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)

class AllDevicesView(generics.ListAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Device.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}
