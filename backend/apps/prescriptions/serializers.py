from rest_framework import serializers
from .models import Medication, Prescription


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    medication_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['prescribed_at', 'dispensed_at', 'is_dispensed', 'quantity_dispensed']

    def get_medication_name(self, obj):
        return str(obj.medication)

    def get_patient_name(self, obj):
        return obj.visit.patient.full_name
