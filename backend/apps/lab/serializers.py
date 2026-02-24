from rest_framework import serializers
from .models import LabTest, LabRequest


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = '__all__'


class LabRequestSerializer(serializers.ModelSerializer):
    test_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = LabRequest
        fields = '__all__'
        read_only_fields = ['requested_at', 'completed_at']

    def get_test_name(self, obj):
        return str(obj.test)

    def get_patient_name(self, obj):
        return obj.visit.patient.full_name
