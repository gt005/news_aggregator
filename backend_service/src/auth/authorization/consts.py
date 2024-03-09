from settings import settings


AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX = settings.REDIS_KEY_PREFIX + ':auth_token'
AUTHORIZATION_TOKEN_LIFETIME = settings.AUTHORIZATION_TOKEN_LIFETIME


class ErrorMessages:
    EMAIL_TAKEN = "Email is already taken."
    INCORRECT_AUTHORIZATION_TOKEN_SCHEMA = "Incorrect authorization token schema."
    INVALID_AUTHORIZATION_TOKEN = "Invalid authorization token."
