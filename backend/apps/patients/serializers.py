from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    registered_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['patient_id', 'registration_date']

    def get_registered_by_name(self, obj):
        if obj.registered_by:
            return str(obj.registered_by)
        return None


class PatientListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()

    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'full_name', 'first_name', 'last_name',
            'gender', 'date_of_birth', 'age', 'phone_number', 'village',
            'district', 'registration_date', 'is_active',
        ]
