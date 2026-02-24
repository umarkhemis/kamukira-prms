from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
import random


User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample Ugandan health facility data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding staff users...')
        self._seed_staff()
        self.stdout.write('Seeding medications...')
        self._seed_medications()
        self.stdout.write('Seeding lab tests...')
        self._seed_lab_tests()
        self.stdout.write('Seeding patients...')
        self._seed_patients()
        self.stdout.write('Seeding visits, diagnoses, prescriptions, and lab requests...')
        self._seed_visits()
        self.stdout.write(self.style.SUCCESS('Seed data created successfully!'))

    def _seed_staff(self):
        staff_data = [
            {'username': 'admin', 'first_name': 'System', 'last_name': 'Administrator',
             'role': 'admin', 'employee_id': 'EMP-001', 'email': 'admin@kamukira.ug',
             'is_superuser': True, 'is_staff': True},
            {'username': 'dr.namukasa', 'first_name': 'Sarah', 'last_name': 'Namukasa',
             'role': 'doctor', 'employee_id': 'EMP-002', 'email': 'namukasa@kamukira.ug'},
            {'username': 'nurse.tumusiime', 'first_name': 'John', 'last_name': 'Tumusiime',
             'role': 'nurse', 'employee_id': 'EMP-003', 'email': 'tumusiime@kamukira.ug'},
            {'username': 'receptionist.nakato', 'first_name': 'Alice', 'last_name': 'Nakato',
             'role': 'receptionist', 'employee_id': 'EMP-004', 'email': 'nakato@kamukira.ug'},
            {'username': 'lab.byamukama', 'first_name': 'Moses', 'last_name': 'Byamukama',
             'role': 'lab_technician', 'employee_id': 'EMP-005', 'email': 'byamukama@kamukira.ug'},
            {'username': 'pharmacist.atuheire', 'first_name': 'Grace', 'last_name': 'Atuheire',
             'role': 'pharmacist', 'employee_id': 'EMP-006', 'email': 'atuheire@kamukira.ug'},
        ]
        for data in staff_data:
            is_superuser = data.pop('is_superuser', False)
            is_staff_flag = data.pop('is_staff', False)
            username = data['username']
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(password='Admin@1234', **data)
                user.is_superuser = is_superuser
                user.is_staff = is_staff_flag or is_superuser
                user.save()
                self.stdout.write(f'  Created user: {username}')
            else:
                self.stdout.write(f'  User already exists: {username}')

    def _seed_medications(self):
        from apps.prescriptions.models import Medication
        medications = [
            ('Artemether-Lumefantrine', 'Antimalarial', '20/120mg', 'Tablet', 500),
            ('Cotrimoxazole', 'Antibiotic', '480mg', 'Tablet', 1000),
            ('Amoxicillin', 'Antibiotic', '500mg', 'Capsule', 800),
            ('Metronidazole', 'Antibiotic', '400mg', 'Tablet', 600),
            ('Paracetamol', 'Analgesic', '500mg', 'Tablet', 2000),
            ('Ibuprofen', 'NSAID', '400mg', 'Tablet', 500),
            ('ORS', 'Electrolyte', '1 sachet', 'Sachet', 300),
            ('Zinc sulfate', 'Supplement', '20mg', 'Tablet', 400),
            ('Ferrous sulfate', 'Iron supplement', '200mg', 'Tablet', 700),
            ('Folic acid', 'Vitamin', '5mg', 'Tablet', 900),
            ('Multivitamins', 'Vitamin', '1 tablet', 'Tablet', 500),
            ('Omeprazole', 'Antacid', '20mg', 'Capsule', 300),
            ('Metformin', 'Antidiabetic', '500mg', 'Tablet', 400),
            ('Amlodipine', 'Antihypertensive', '5mg', 'Tablet', 350),
            ('Atenolol', 'Beta-blocker', '50mg', 'Tablet', 300),
            ('Doxycycline', 'Antibiotic', '100mg', 'Capsule', 400),
            ('Ciprofloxacin', 'Antibiotic', '500mg', 'Tablet', 350),
            ('Albendazole', 'Anthelmintic', '400mg', 'Tablet', 600),
            ('Vitamin A', 'Vitamin', '200,000 IU', 'Capsule', 500),
            ('Normal Saline (IV)', 'IV Fluid', '0.9% 500ml', 'Bag', 100),
        ]
        for name, category, strength, dosage_form, stock in medications:
            Medication.objects.get_or_create(
                name=name,
                defaults={
                    'generic_name': name,
                    'dosage_form': dosage_form,
                    'strength': strength,
                    'stock_quantity': stock,
                    'is_available': True,
                }
            )

    def _seed_lab_tests(self):
        from apps.lab.models import LabTest
        tests = [
            ('Malaria RDT', 'Parasitology', 'Negative', '', 3000),
            ('Full Blood Count (FBC)', 'Haematology', 'See reference ranges', 'cells/µL', 15000),
            ('Blood Glucose (Random)', 'Biochemistry', '3.9–7.8 mmol/L', 'mmol/L', 5000),
            ('Urine Routine', 'Urinalysis', 'No abnormalities', '', 4000),
            ('Stool Microscopy', 'Parasitology', 'No ova/cysts seen', '', 5000),
            ('HIV Test (Rapid)', 'Serology', 'Non-reactive', '', 0),
            ('Hepatitis B Surface Antigen', 'Serology', 'Non-reactive', '', 10000),
            ('Widal Test (Typhoid)', 'Serology', 'TO < 1:80, TH < 1:80', '', 10000),
            ('Sputum AFB (TB)', 'Microbiology', 'No AFB seen', '', 0),
            ('Pregnancy Test (urine)', 'Serology', 'Negative', '', 3000),
            ('CD4 Count', 'Immunology', '500–1500 cells/µL', 'cells/µL', 20000),
            ('Liver Function Tests', 'Biochemistry', 'See reference ranges', 'U/L', 25000),
            ('Renal Function Tests', 'Biochemistry', 'See reference ranges', 'mmol/L', 20000),
            ('Electrolytes', 'Biochemistry', 'See reference ranges', 'mmol/L', 20000),
            ('ESR', 'Haematology', 'Males <15mm/hr, Females <20mm/hr', 'mm/hr', 5000),
        ]
        for name, category, normal_range, unit, price in tests:
            LabTest.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'normal_range': normal_range,
                    'unit': unit,
                    'price': price,
                }
            )

    def _seed_patients(self):
        from apps.patients.models import Patient
        receptionist = User.objects.filter(role='receptionist').first()
        patients_data = [
            ('Aisha', 'Nakiganda', 'F', '1990-03-15', '0772100001', 'Kyarumba', 'Kyarumba'),
            ('Robert', 'Bwambale', 'M', '1985-07-22', '0772100002', 'Hima', 'Hima'),
            ('Mary', 'Kabasinguzi', 'F', '2000-11-05', '0772100003', 'Kasese Town', 'Kasese'),
            ('James', 'Muhindo', 'M', '1975-01-30', '0772100004', 'Bulembia', 'Bulembia'),
            ('Grace', 'Biira', 'F', '1995-08-12', '0772100005', 'Karusandara', 'Karusandara'),
            ('Peter', 'Mumbere', 'M', '1960-04-18', '0772100006', 'Maliba', 'Maliba'),
            ('Sarah', 'Kyomuhendo', 'F', '1988-12-01', '0772100007', 'Nyakiyumbu', 'Nyakiyumbu'),
            ('John', 'Baluku', 'M', '2005-06-25', '0772100008', 'Bugoye', 'Bugoye'),
            ('Agnes', 'Kabugho', 'F', '1992-09-14', '0772100009', 'Kilembe', 'Kilembe'),
            ('David', 'Kule', 'M', '1970-02-28', '0772100010', 'Rwimi', 'Rwimi'),
            ('Esther', 'Nzaghali', 'F', '1998-05-07', '0772100011', 'Mahango', 'Maliba'),
            ('Emmanuel', 'Muhesi', 'M', '1983-10-19', '0772100012', 'Bwesumbu', 'Bulembia'),
            ('Juliet', 'Bakulima', 'F', '2003-03-31', '0772100013', 'Kitswamba', 'Kitswamba'),
            ('Moses', 'Masereka', 'M', '1967-08-08', '0772100014', 'Ibanda', 'Ibanda'),
            ('Ruth', 'Ahimbisibwe', 'F', '1993-11-22', '0772100015', 'Kagando', 'Bugoye'),
            ('Isaac', 'Bwire', 'M', '1980-01-15', '0772100016', 'Kisinga', 'Kisinga'),
            ('Lydia', 'Tibamwenda', 'F', '2001-07-04', '0772100017', 'Munkunyu', 'Munkunyu'),
            ('Samuel', 'Nzabarinda', 'M', '1955-04-11', '0772100018', 'Bwera', 'Bwera'),
            ('Harriet', 'Nambooze', 'F', '1987-09-27', '0772100019', 'Katwe', 'Katwe'),
            ('Francis', 'Kacwamu', 'M', '1972-06-16', '0772100020', 'Mpondwe', 'Mpondwe'),
        ]
        for first, last, gender, dob, phone, village, sub_county in patients_data:
            if not Patient.objects.filter(phone_number=phone).exists():
                Patient.objects.create(
                    first_name=first,
                    last_name=last,
                    gender=gender,
                    date_of_birth=date.fromisoformat(dob),
                    phone_number=phone,
                    village=village,
                    sub_county=sub_county,
                    district='Kasese',
                    address=f'{village}, {sub_county}, Kasese District',
                    next_of_kin_name=f'Next of Kin of {first}',
                    next_of_kin_phone=f'077210{random.randint(1000, 9999)}',
                    next_of_kin_relationship='Spouse',
                    registered_by=receptionist,
                )

    def _seed_visits(self):
        from apps.patients.models import Patient
        from apps.visits.models import Visit, Diagnosis
        from apps.prescriptions.models import Medication, Prescription
        from apps.lab.models import LabTest, LabRequest

        doctor = User.objects.filter(role='doctor').first()
        nurse = User.objects.filter(role='nurse').first()
        patients = list(Patient.objects.all()[:10])
        diagnoses_data = [
            ('Malaria', 'B54'),
            ('Pulmonary Tuberculosis', 'A15.0'),
            ('Typhoid Fever', 'A01.0'),
            ('HIV/AIDS', 'B20'),
            ('Pneumonia', 'J18.9'),
            ('Acute Diarrhoea', 'A09'),
            ('Iron Deficiency Anaemia', 'D50'),
            ('Hypertension', 'I10'),
            ('Type 2 Diabetes Mellitus', 'E11'),
            ('Severe Acute Malnutrition', 'E43'),
        ]
        medications = list(Medication.objects.all())
        lab_tests = list(LabTest.objects.all())

        for i, patient in enumerate(patients):
            if Visit.objects.filter(patient=patient).exists():
                continue
            visit = Visit.objects.create(
                patient=patient,
                visit_type=random.choice(['outpatient', 'inpatient', 'emergency', 'follow_up']),
                attending_doctor=doctor,
                triage_nurse=nurse,
                chief_complaint='Fever, headache and general body weakness',
                weight=round(random.uniform(45, 90), 1),
                height=round(random.uniform(150, 185), 1),
                temperature=round(random.uniform(36.5, 39.5), 1),
                blood_pressure_systolic=random.randint(100, 160),
                blood_pressure_diastolic=random.randint(60, 100),
                pulse_rate=random.randint(60, 110),
                respiratory_rate=random.randint(14, 24),
                oxygen_saturation=round(random.uniform(94, 99), 1),
                status=random.choice(['waiting', 'in_progress', 'completed']),
            )
            diag_name, icd_code = diagnoses_data[i % len(diagnoses_data)]
            Diagnosis.objects.create(
                visit=visit,
                icd_code=icd_code,
                diagnosis_name=diag_name,
                diagnosis_type='primary',
                diagnosed_by=doctor,
            )
            if medications:
                med = medications[i % len(medications)]
                Prescription.objects.create(
                    visit=visit,
                    medication=med,
                    dosage='As directed',
                    frequency='Twice daily',
                    duration='5 days',
                    quantity_prescribed=10,
                    prescribed_by=doctor,
                )
            if lab_tests:
                lab_test = lab_tests[i % len(lab_tests)]
                LabRequest.objects.create(
                    visit=visit,
                    test=lab_test,
                    requested_by=doctor,
                    status='pending',
                    urgency='routine',
                )
