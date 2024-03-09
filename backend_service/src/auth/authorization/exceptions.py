from src.auth.authorization.consts import ErrorMessages
from src.exceptions import UnprocessableEntity
from fastapi import status


class EmailTaken(UnprocessableEntity):
    DETAIL = ErrorMessages.EMAIL_TAKEN


class IncorrectAuthorizationTokenSchema(UnprocessableEntity):
    STATUS_CODE = status.HTTP_403_FORBIDDEN
    DETAIL = ErrorMessages.INCORRECT_AUTHORIZATION_TOKEN_SCHEMA


class InvalidAuthorizationToken(UnprocessableEntity):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = ErrorMessages.INVALID_AUTHORIZATION_TOKEN
