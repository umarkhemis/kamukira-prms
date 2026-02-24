from django.contrib.auth.models import AbstractUser
from django.db import models


class StaffUser(AbstractUser):
    ROLES = [
        ('admin', 'Administrator'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
        ('receptionist', 'Receptionist'),
        ('lab_technician', 'Lab Technician'),
        ('pharmacist', 'Pharmacist'),
    ]
    role = models.CharField(max_length=20, choices=ROLES, default='receptionist')
    phone_number = models.CharField(max_length=15, blank=True)
    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    department = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='staff/', blank=True, null=True)

    class Meta:
        verbose_name = 'Staff User'
        verbose_name_plural = 'Staff Users'

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
