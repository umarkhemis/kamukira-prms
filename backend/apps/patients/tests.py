from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Patient
from datetime import date

User = get_user_model()


class PatientModelTest(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username='recep', password='pass123', role='receptionist')

    def test_patient_id_auto_generation(self):
        patient = Patient.objects.create(
            first_name='John',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='M',
            phone_number='0700000001',
            address='Test Address',
            village='Test Village',
            sub_county='Test Sub County',
            next_of_kin_name='Jane Doe',
            next_of_kin_phone='0700000002',
            next_of_kin_relationship='Spouse',
            registered_by=self.staff,
        )
        self.assertTrue(patient.patient_id.startswith('KAM-'))
        self.assertEqual(len(patient.patient_id.split('-')), 3)

    def test_patient_id_sequential(self):
        for i in range(3):
            Patient.objects.create(
                first_name=f'Patient{i}',
                last_name='Test',
                date_of_birth=date(1990, 1, 1),
                gender='F',
                phone_number=f'070000000{i}',
                address='Addr',
                village='V',
                sub_county='SC',
                next_of_kin_name='NOK',
                next_of_kin_phone='0700000099',
                next_of_kin_relationship='Parent',
            )
        patients = Patient.objects.all().order_by('id')
        ids = [p.patient_id for p in patients]
        self.assertNotEqual(ids[0], ids[1])
        self.assertNotEqual(ids[1], ids[2])

    def test_patient_str(self):
        patient = Patient.objects.create(
            first_name='Alice',
            last_name='Smith',
            date_of_birth=date(1985, 5, 15),
            gender='F',
            phone_number='0700000010',
            address='Addr',
            village='V',
            sub_county='SC',
            next_of_kin_name='Bob Smith',
            next_of_kin_phone='0700000011',
            next_of_kin_relationship='Spouse',
        )
        self.assertIn('Alice Smith', str(patient))
