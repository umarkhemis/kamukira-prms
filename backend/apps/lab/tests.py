from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.patients.models import Patient
from apps.visits.models import Visit
from apps.lab.models import LabTest, LabRequest
from datetime import date

User = get_user_model()


class LabModelTest(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username='labtech', password='pass123', role='lab_technician')
        self.patient = Patient.objects.create(
            first_name='Test', last_name='Patient',
            date_of_birth=date(1990, 1, 1), gender='M',
            phone_number='0700000001', address='Addr',
            village='V', sub_county='SC',
            next_of_kin_name='NOK', next_of_kin_phone='0700000002',
            next_of_kin_relationship='Spouse',
        )
        self.visit = Visit.objects.create(
            patient=self.patient,
            visit_type='outpatient',
            chief_complaint='Fever',
        )
        self.lab_test = LabTest.objects.create(
            name='Malaria RDT',
            category='Parasitology',
            normal_range='Negative',
            unit='',
        )

    def test_lab_test_str(self):
        self.assertIn('Malaria RDT', str(self.lab_test))

    def test_lab_request_creation(self):
        req = LabRequest.objects.create(
            visit=self.visit,
            test=self.lab_test,
            requested_by=self.staff,
            urgency='urgent',
        )
        self.assertEqual(req.status, 'pending')
        self.assertIn('Malaria RDT', str(req))
