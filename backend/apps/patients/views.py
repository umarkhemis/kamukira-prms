from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Patient
from .serializers import PatientSerializer, PatientListSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['gender', 'district', 'is_active']
    search_fields = ['first_name', 'last_name', 'patient_id', 'phone_number', 'village', 'national_id']
    ordering_fields = ['registration_date', 'last_name', 'first_name']
    ordering = ['-registration_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return PatientListSerializer
        return PatientSerializer

    def perform_create(self, serializer):
        serializer.save(registered_by=self.request.user)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        patient = self.get_object()
        from apps.visits.serializers import VisitSerializer
        visits = patient.visits.all().order_by('-visit_date')
        serializer = VisitSerializer(visits, many=True)
        return Response({
            'status': 'success',
            'data': {
                'patient': PatientSerializer(patient).data,
                'visits': serializer.data,
            }
        })
