from rest_framework import serializers
from .models import Device, RentalRequest, Chat

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class DeviceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ['owner']

class RentalRequestSerializer(serializers.ModelSerializer):
    renter_email = serializers.EmailField(source='renter.email', read_only=True)
    device_title = serializers.CharField(source='device.title', read_only=True)

    class Meta:
        model = RentalRequest
        fields = ['id', 'device', 'device_title', 'start_date', 'end_date', 'approved', 'renter_email']
        read_only_fields = ['approved', 'renter_email', 'device_title']

class ChatSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'request', 'sender', 'sender_email', 'message', 'timestamp']
        read_only_fields = ['sender', 'timestamp', 'sender_email']
