
from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS,
    IsAuthenticated,
    IsAdminUser,
    AllowAny,
    DjangoModelPermissionsOrAnonReadOnly
)


class IsAnonymousOnly(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user.is_anonymous)
