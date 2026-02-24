from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import LabTest, LabRequest
from .serializers import LabTestSerializer, LabRequestSerializer


class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LabTestSerializer
    search_fields = ['name', 'category']
    filterset_fields = ['category']


class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LabRequestSerializer
    filterset_fields = ['visit', 'status', 'urgency', 'requested_by', 'technician']
    search_fields = ['test__name', 'visit__patient__first_name', 'visit__patient__last_name']
    ordering = ['-requested_at']

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

    @action(detail=True, methods=['put', 'patch'])
    def result(self, request, pk=None):
        lab_request = self.get_object()
        lab_request.result_value = request.data.get('result_value', lab_request.result_value)
        lab_request.result_unit = request.data.get('result_unit', lab_request.result_unit)
        lab_request.result_notes = request.data.get('result_notes', lab_request.result_notes)
        lab_request.is_abnormal = request.data.get('is_abnormal', lab_request.is_abnormal)
        lab_request.status = 'completed'
        lab_request.technician = request.user
        lab_request.completed_at = timezone.now()
        lab_request.save()
        return Response({'status': 'success', 'data': LabRequestSerializer(lab_request).data})
