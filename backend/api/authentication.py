from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

from .models import Personal


class PersonalUser:
    """Duck-typed wrapper so DRF treats a Personal instance as a user."""

    def __init__(self, personal: Personal):
        self.personal = personal
        self.id = personal.id
        self.pk = personal.id
        self.username = personal.username
        self.nombre = personal.nombre
        self.rol = personal.rol
        self.is_authenticated = True
        self.is_active = personal.activo

    @property
    def is_staff(self):
        return True

    def __str__(self):
        return self.username


class PersonalJWTAuthentication(JWTAuthentication):
    """
    Authenticates Personal (staff) users via JWT tokens that carry
    a `personal_id` claim instead of the standard Django user_id.
    """

    def get_user(self, validated_token):
        try:
            personal_id = validated_token["personal_id"]
        except KeyError:
            raise InvalidToken("Token does not contain personal_id claim.")

        try:
            personal = Personal.objects.get(id=personal_id, activo=True)
        except Personal.DoesNotExist:
            raise AuthenticationFailed("Personal no encontrado o inactivo.")

        return PersonalUser(personal)
