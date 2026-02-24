from django.db import models
from datetime import datetime


class Visit(models.Model):
    VISIT_TYPES = [
        ('outpatient', 'Outpatient'),
        ('inpatient', 'Inpatient'),
        ('emergency', 'Emergency'),
        ('antenatal', 'Antenatal'),
        ('immunization', 'Immunization'),
        ('follow_up', 'Follow Up'),
    ]
    STATUS = [
        ('waiting', 'Waiting'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('referred', 'Referred'),
    ]

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='visits')
    visit_number = models.CharField(max_length=20, unique=True, editable=False)
    visit_type = models.CharField(max_length=20, choices=VISIT_TYPES, default='outpatient')
    visit_date = models.DateTimeField(auto_now_add=True)
    attending_doctor = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='attended_visits'
    )
    triage_nurse = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='triaged_visits'
    )
    chief_complaint = models.TextField()
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    pulse_rate = models.IntegerField(null=True, blank=True)
    respiratory_rate = models.IntegerField(null=True, blank=True)
    oxygen_saturation = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='waiting')
    notes = models.TextField(blank=True)
    discharge_date = models.DateTimeField(null=True, blank=True)
    referral_hospital = models.CharField(max_length=200, blank=True)
    referral_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-visit_date']

    def save(self, *args, **kwargs):
        if not self.visit_number:
            year = datetime.now().year
            last = Visit.objects.filter(visit_number__startswith=f'VIS-{year}').count()
            self.visit_number = f'VIS-{year}-{str(last + 1).zfill(6)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.visit_number} - {self.patient} ({self.visit_date.date()})"


class Diagnosis(models.Model):
    DIAGNOSIS_TYPES = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('provisional', 'Provisional'),
    ]
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='diagnoses')
    icd_code = models.CharField(max_length=10, blank=True)
    diagnosis_name = models.CharField(max_length=200)
    diagnosis_type = models.CharField(max_length=20, choices=DIAGNOSIS_TYPES, default='primary')
    notes = models.TextField(blank=True)
    diagnosed_by = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name_plural = 'Diagnoses'

    def __str__(self):
        return f"{self.diagnosis_name} ({self.icd_code}) - {self.visit.visit_number}"
