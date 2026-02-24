from django.test import TestCase
from apps.staff.models import StaffUser


class StaffUserModelTest(TestCase):
    def test_create_staff_user(self):
        user = StaffUser.objects.create_user(
            username='testdoctor',
            password='testpass123',
            role='doctor',
            employee_id='EMP001',
        )
        self.assertEqual(user.role, 'doctor')
        self.assertEqual(str(user), 'testdoctor (Doctor)')

    def test_staff_user_str_with_full_name(self):
        user = StaffUser.objects.create_user(
            username='testnurse',
            password='testpass123',
            first_name='Jane',
            last_name='Doe',
            role='nurse',
            employee_id='EMP002',
        )
        self.assertIn('Jane Doe', str(user))
