from django.urls import path
from .views import DashboardView, VisitReportView, DiseaseReportView, PatientDemographicsView, LabReportView

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('visits/', VisitReportView.as_view(), name='report-visits'),
    path('diseases/', DiseaseReportView.as_view(), name='report-diseases'),
    path('patients/', PatientDemographicsView.as_view(), name='report-patients'),
    path('lab/', LabReportView.as_view(), name='report-lab'),
]
