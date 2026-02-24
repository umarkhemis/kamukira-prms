from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import StaffUser


class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'employee_id', 'department',
            'profile_picture', 'is_active', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']


class StaffUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = StaffUser
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 'password2',
            'role', 'phone_number', 'employee_id', 'department',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        return StaffUser.objects.create_user(**validated_data)
