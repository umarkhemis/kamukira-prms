from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Medication, Prescription
from .serializers import MedicationSerializer, PrescriptionSerializer


class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MedicationSerializer
    search_fields = ['name', 'generic_name']
    filterset_fields = ['is_available', 'dosage_form']


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PrescriptionSerializer
    filterset_fields = ['visit', 'is_dispensed', 'prescribed_by']
    search_fields = ['medication__name', 'visit__patient__first_name', 'visit__patient__last_name']
    ordering = ['-prescribed_at']

    def get_serializer_class(self):
        return PrescriptionSerializer

    def perform_create(self, serializer):
        serializer.save(prescribed_by=self.request.user)

    @action(detail=True, methods=['put', 'patch'])
    def dispense(self, request, pk=None):
        prescription = self.get_object()
        if prescription.is_dispensed:
            return Response(
                {'status': 'error', 'message': 'Already dispensed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        quantity = request.data.get('quantity_dispensed', prescription.quantity_prescribed)
        prescription.quantity_dispensed = quantity
        prescription.is_dispensed = True
        prescription.dispensed_by = request.user
        prescription.dispensed_at = timezone.now()
        prescription.save()
        # Update stock
        med = prescription.medication
        med.stock_quantity = max(0, med.stock_quantity - int(quantity))
        med.save()
        return Response({'status': 'success', 'data': PrescriptionSerializer(prescription).data})
