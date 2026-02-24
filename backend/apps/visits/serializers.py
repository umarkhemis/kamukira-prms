from rest_framework import serializers
from .models import Visit, Diagnosis


class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = '__all__'
        read_only_fields = ['created_at']


class VisitSerializer(serializers.ModelSerializer):
    diagnoses = DiagnosisSerializer(many=True, read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ['visit_number', 'visit_date']

    def get_patient_name(self, obj):
        return obj.patient.full_name


class VisitListSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_id_code = serializers.SerializerMethodField()

    class Meta:
        model = Visit
        fields = [
            'id', 'visit_number', 'patient', 'patient_name', 'patient_id_code',
            'visit_type', 'visit_date', 'status', 'chief_complaint',
        ]

    def get_patient_name(self, obj):
        return obj.patient.full_name

    def get_patient_id_code(self, obj):
        return obj.patient.patient_id
