from rest_framework import serializers
from .models import Device
from .models import RentalRequest
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class DeviceSerializer(serializers.ModelSerializer):
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