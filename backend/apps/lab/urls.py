from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabTestViewSet, LabRequestViewSet

router = DefaultRouter()
router.register('tests', LabTestViewSet, basename='lab-test')
router.register('requests', LabRequestViewSet, basename='lab-request')

urlpatterns = [
    path('', include(router.urls)),
]
