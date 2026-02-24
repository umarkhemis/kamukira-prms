from django.db import models


class LabTest(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    normal_range = models.CharField(max_length=200, blank=True)
    unit = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class LabRequest(models.Model):
    STATUS = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    URGENCY = [
        ('routine', 'Routine'),
        ('urgent', 'Urgent'),
        ('stat', 'STAT'),
    ]

    visit = models.ForeignKey('visits.Visit', on_delete=models.CASCADE, related_name='lab_requests')
    test = models.ForeignKey(LabTest, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='lab_requests_made'
    )
    technician = models.ForeignKey(
        'staff.StaffUser', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='lab_tests_done'
    )
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    urgency = models.CharField(max_length=10, choices=URGENCY, default='routine')
    result_value = models.CharField(max_length=200, blank=True)
    result_unit = models.CharField(max_length=50, blank=True)
    result_notes = models.TextField(blank=True)
    is_abnormal = models.BooleanField(default=False)
    requested_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-requested_at']

    def __str__(self):
        return f"{self.test.name} for {self.visit.patient.full_name} [{self.status}]"
