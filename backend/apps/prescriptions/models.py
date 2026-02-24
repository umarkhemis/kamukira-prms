from django.db import models


class Medication(models.Model):
    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=200, blank=True)
    dosage_form = models.CharField(max_length=100)
    strength = models.CharField(max_length=50)
    stock_quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=20, default='units')
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} {self.strength} ({self.dosage_form})"


class Prescription(models.Model):
    visit = models.ForeignKey('visits.Visit', on_delete=models.CASCADE, related_name='prescriptions')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    quantity_prescribed = models.IntegerField()
    quantity_dispensed = models.IntegerField(default=0)
    instructions = models.TextField(blank=True)
    prescribed_by = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='prescribed'
    )
    dispensed_by = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='dispensed'
    )
    prescribed_at = models.DateTimeField(auto_now_add=True)
    dispensed_at = models.DateTimeField(null=True, blank=True)
    is_dispensed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-prescribed_at']

    def __str__(self):
        return f"{self.medication.name} for {self.visit.patient.full_name}"
