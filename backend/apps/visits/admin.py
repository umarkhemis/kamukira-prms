from django.contrib import admin
from .models import Visit, Diagnosis


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ['visit_number', 'patient', 'visit_type', 'visit_date', 'status']
    list_filter = ['visit_type', 'status']
    search_fields = ['visit_number', 'patient__first_name', 'patient__last_name']
    readonly_fields = ['visit_number', 'visit_date']


@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    list_display = ['diagnosis_name', 'icd_code', 'visit', 'diagnosis_type', 'created_at']
    search_fields = ['diagnosis_name', 'icd_code']
