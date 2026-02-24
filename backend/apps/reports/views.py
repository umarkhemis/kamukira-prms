from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta, date
from apps.patients.models import Patient
from apps.visits.models import Visit, Diagnosis
from apps.prescriptions.models import Prescription
from apps.lab.models import LabRequest


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        total_patients = Patient.objects.filter(is_active=True).count()
        today_visits = Visit.objects.filter(visit_date__date=today).count()
        pending_labs = LabRequest.objects.filter(status='pending').count()
        pending_prescriptions = Prescription.objects.filter(is_dispensed=False).count()
        recent_visits = Visit.objects.select_related('patient').order_by('-visit_date')[:10]

        return Response({
            'status': 'success',
            'data': {
                'total_patients': total_patients,
                'today_visits': today_visits,
                'pending_labs': pending_labs,
                'pending_prescriptions': pending_prescriptions,
                'recent_visits': [
                    {
                        'id': v.id,
                        'visit_number': v.visit_number,
                        'patient_name': v.patient.full_name,
                        'visit_type': v.visit_type,
                        'visit_date': v.visit_date,
                        'status': v.status,
                    }
                    for v in recent_visits
                ],
            }
        })


class VisitReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        qs = Visit.objects.all()
        if date_from:
            qs = qs.filter(visit_date__date__gte=date_from)
        if date_to:
            qs = qs.filter(visit_date__date__lte=date_to)

        by_type = qs.values('visit_type').annotate(count=Count('id'))
        by_status = qs.values('status').annotate(count=Count('id'))

        return Response({
            'status': 'success',
            'data': {
                'total': qs.count(),
                'by_type': list(by_type),
                'by_status': list(by_status),
            }
        })


class DiseaseReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        qs = Diagnosis.objects.all()
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        top_diseases = qs.values('diagnosis_name', 'icd_code').annotate(
            count=Count('id')
        ).order_by('-count')[:10]

        return Response({
            'status': 'success',
            'data': list(top_diseases)
        })


class PatientDemographicsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        by_gender = Patient.objects.values('gender').annotate(count=Count('id'))
        by_district = Patient.objects.values('district').annotate(count=Count('id')).order_by('-count')
        return Response({
            'status': 'success',
            'data': {
                'by_gender': list(by_gender),
                'by_district': list(by_district),
                'total': Patient.objects.count(),
            }
        })


class LabReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        qs = LabRequest.objects.all()
        if date_from:
            qs = qs.filter(requested_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(requested_at__date__lte=date_to)

        by_test = qs.values('test__name').annotate(count=Count('id')).order_by('-count')
        abnormal = qs.filter(is_abnormal=True).count()

        return Response({
            'status': 'success',
            'data': {
                'total': qs.count(),
                'abnormal': abnormal,
                'by_test': list(by_test),
            }
        })
