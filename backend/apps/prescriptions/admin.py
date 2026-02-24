from django.contrib import admin
from .models import Medication, Prescription


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'generic_name', 'dosage_form', 'strength', 'stock_quantity', 'is_available']
    list_filter = ['is_available', 'dosage_form']
    search_fields = ['name', 'generic_name']


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['medication', 'visit', 'quantity_prescribed', 'is_dispensed', 'prescribed_at']
    list_filter = ['is_dispensed']
    search_fields = ['medication__name', 'visit__patient__first_name']
