from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StaffUser
from .serializers import StaffUserSerializer, StaffUserCreateSerializer


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role == 'admin'
        )


class StaffViewSet(viewsets.ModelViewSet):
    queryset = StaffUser.objects.all().order_by('username')
    search_fields = ['username', 'first_name', 'last_name', 'email', 'employee_id']
    filterset_fields = ['role', 'is_active']

    def get_serializer_class(self):
        if self.action == 'create':
            return StaffUserCreateSerializer
        return StaffUserSerializer

    def get_permissions(self):
        if self.action in ['me', 'list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminRole()]

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = StaffUserSerializer(request.user)
            return Response({'status': 'success', 'data': serializer.data})
        serializer = StaffUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
