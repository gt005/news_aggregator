from auth.authorization.consts import ErrorMessages
from src.exceptions import UnprocessableEntity


class EmailTaken(UnprocessableEntity):
    DETAIL = ErrorMessages.EMAIL_TAKEN
