from fastapi import status

from src.common.exceptions import DetailedHTTPException


class BadRequest(DetailedHTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Bad request"


class NotAuthenticated(DetailedHTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "User not authenticated"

    def __init__(self) -> None:
        super().__init__(headers={"WWW-Authenticate": "Bearer"})


class PermissionDenied(DetailedHTTPException):
    STATUS_CODE = status.HTTP_403_FORBIDDEN
    DETAIL = "Permission denied"


class NotFound(DetailedHTTPException):
    STATUS_CODE = status.HTTP_404_NOT_FOUND
    DETAIL = "Not found"


class UnprocessableEntity(DetailedHTTPException):
    STATUS_CODE = status.HTTP_422_UNPROCESSABLE_ENTITY
    DETAIL = "Unprocessable entity"
