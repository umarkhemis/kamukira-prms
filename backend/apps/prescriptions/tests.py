from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.patients.models import Patient
from apps.visits.models import Visit
from apps.prescriptions.models import Medication, Prescription
from datetime import date

User = get_user_model()


class PrescriptionModelTest(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username='doc2', password='pass123', role='doctor')
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
        self.medication = Medication.objects.create(
            name='Artemether-Lumefantrine',
            dosage_form='tablet',
            strength='20/120mg',
            stock_quantity=100,
        )

    def test_medication_str(self):
        self.assertIn('Artemether-Lumefantrine', str(self.medication))

    def test_prescription_creation(self):
        prescription = Prescription.objects.create(
            visit=self.visit,
            medication=self.medication,
            dosage='2 tablets',
            frequency='twice daily',
            duration='3 days',
            quantity_prescribed=12,
            prescribed_by=self.staff,
        )
        self.assertFalse(prescription.is_dispensed)
        self.assertIn('Artemether-Lumefantrine', str(prescription))
