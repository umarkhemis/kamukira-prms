from django.db import models
from datetime import datetime


class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    BLOOD_GROUPS = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'), ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]

    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS, blank=True)
    national_id = models.CharField(max_length=20, blank=True)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    address = models.TextField()
    village = models.CharField(max_length=100)
    sub_county = models.CharField(max_length=100)
    district = models.CharField(max_length=100, default='Kasese')
    next_of_kin_name = models.CharField(max_length=200)
    next_of_kin_phone = models.CharField(max_length=15)
    next_of_kin_relationship = models.CharField(max_length=50)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    registered_by = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-registration_date']

    def save(self, *args, **kwargs):
        if not self.patient_id:
            year = datetime.now().year
            last = Patient.objects.filter(patient_id__startswith=f'KAM-{year}').count()
            self.patient_id = f'KAM-{year}-{str(last + 1).zfill(5)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient_id} - {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        from datetime import date
        today = date.today()
        born = self.date_of_birth
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
