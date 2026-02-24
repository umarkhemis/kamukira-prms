from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['patient_id', 'full_name', 'gender', 'date_of_birth', 'phone_number', 'district', 'is_active']
    list_filter = ['gender', 'district', 'is_active']
    search_fields = ['first_name', 'last_name', 'patient_id', 'phone_number']
    readonly_fields = ['patient_id', 'registration_date']
