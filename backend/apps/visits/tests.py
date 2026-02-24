from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.patients.models import Patient
from apps.visits.models import Visit, Diagnosis
from datetime import date

User = get_user_model()


class VisitModelTest(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username='doc', password='pass123', role='doctor')
        self.patient = Patient.objects.create(
            first_name='Test', last_name='Patient',
            date_of_birth=date(1990, 1, 1), gender='M',
            phone_number='0700000001', address='Addr',
            village='V', sub_county='SC',
            next_of_kin_name='NOK', next_of_kin_phone='0700000002',
            next_of_kin_relationship='Spouse',
        )

    def test_visit_number_auto_generation(self):
        visit = Visit.objects.create(
            patient=self.patient,
            visit_type='outpatient',
            chief_complaint='Fever',
            attending_doctor=self.staff,
        )
        self.assertTrue(visit.visit_number.startswith('VIS-'))

    def test_diagnosis_creation(self):
        visit = Visit.objects.create(
            patient=self.patient,
            visit_type='outpatient',
            chief_complaint='Cough',
        )
        diagnosis = Diagnosis.objects.create(
            visit=visit,
            diagnosis_name='Malaria',
            icd_code='B54',
            diagnosis_type='primary',
        )
        self.assertEqual(str(diagnosis), 'Malaria (B54) - ' + visit.visit_number)
