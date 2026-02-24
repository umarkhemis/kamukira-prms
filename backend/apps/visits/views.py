from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Visit, Diagnosis
from .serializers import VisitSerializer, VisitListSerializer, DiagnosisSerializer
import django_filters


class VisitFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='visit_date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='visit_date', lookup_expr='lte')

    class Meta:
        model = Visit
        fields = ['patient', 'visit_type', 'status', 'attending_doctor', 'date_from', 'date_to']


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VisitFilter
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__patient_id', 'visit_number']
    ordering_fields = ['visit_date', 'status']
    ordering = ['-visit_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return VisitListSerializer
        return VisitSerializer

    @action(detail=True, methods=['post'])
    def diagnoses(self, request, pk=None):
        visit = self.get_object()
        serializer = DiagnosisSerializer(data={**request.data, 'visit': visit.id})
        if serializer.is_valid():
            serializer.save(visit=visit, diagnosed_by=request.user)
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['visit', 'diagnosis_type']
    search_fields = ['diagnosis_name', 'icd_code']
