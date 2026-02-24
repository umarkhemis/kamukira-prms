from rest_framework import viewsets, permissions
from .models import AuditLog
from rest_framework import serializers


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


class IsAdminOrSuperuser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role == 'admin'
        )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrSuperuser]
    filterset_fields = ['action', 'model_name', 'user']
    search_fields = ['description', 'model_name']
    ordering = ['-timestamp']
