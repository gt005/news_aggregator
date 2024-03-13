from src.auth.authorization.consts import ErrorMessages
from src.exceptions import PermissionDenied, UnprocessableEntity


class EmailTaken(UnprocessableEntity):
    DETAIL = ErrorMessages.EMAIL_TAKEN


class IncorrectAuthorizationTokenSchema(PermissionDenied):
    DETAIL = ErrorMessages.INCORRECT_AUTHORIZATION_TOKEN_SCHEMA
