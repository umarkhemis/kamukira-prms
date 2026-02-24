from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.apps import apps


class SyncPushView(APIView):
    """Accept a batch of offline-created records."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        records = request.data.get('records', [])
        results = []
        for record in records:
            results.append({'id': record.get('id'), 'status': 'accepted'})
        return Response({
            'status': 'success',
            'message': f'{len(results)} records received',
            'results': results,
        })


class SyncPullView(APIView):
    """Pull records updated since last sync timestamp."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        since = request.query_params.get('since')
        data = {}
        if since:
            from apps.patients.models import Patient
            from apps.visits.models import Visit
            from apps.prescriptions.models import Prescription
            from apps.lab.models import LabRequest
            from apps.patients.serializers import PatientSerializer
            from apps.visits.serializers import VisitSerializer

            patients = Patient.objects.filter(registration_date__gt=since)
            visits = Visit.objects.filter(visit_date__gt=since)

            data = {
                'patients': PatientSerializer(patients, many=True).data,
                'visits': VisitSerializer(visits, many=True).data,
            }

        return Response({
            'status': 'success',
            'timestamp': timezone.now().isoformat(),
            'data': data,
        })
