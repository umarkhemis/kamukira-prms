from django.contrib import admin
from .models import LabTest, LabRequest


@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'normal_range', 'unit', 'price']
    list_filter = ['category']
    search_fields = ['name']


@admin.register(LabRequest)
class LabRequestAdmin(admin.ModelAdmin):
    list_display = ['test', 'visit', 'status', 'urgency', 'is_abnormal', 'requested_at']
    list_filter = ['status', 'urgency', 'is_abnormal']
    search_fields = ['test__name', 'visit__patient__first_name']
