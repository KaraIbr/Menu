from rest_framework.permissions import BasePermission

from .authentication import PersonalUser


def _get_personal_user(request):
    user = getattr(request, "user", None)
    if user and isinstance(user, PersonalUser) and user.is_authenticated:
        return user
    return None


class IsStaffPersonal(BasePermission):
    """Any authenticated Personal member (barista, cocinero, admin)."""

    def has_permission(self, request, view):
        return _get_personal_user(request) is not None


class IsAdminPersonal(BasePermission):
    """Only Personal members with the 'admin' role."""

    def has_permission(self, request, view):
        user = _get_personal_user(request)
        if user is None:
            return False
        return user.rol == "admin"
