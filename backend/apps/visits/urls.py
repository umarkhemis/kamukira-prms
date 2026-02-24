from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisitViewSet, DiagnosisViewSet

router = DefaultRouter()
router.register('diagnoses', DiagnosisViewSet, basename='diagnosis')
router.register('', VisitViewSet, basename='visit')

urlpatterns = [
    path('', include(router.urls)),
]
