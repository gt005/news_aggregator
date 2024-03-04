from auth.authorization.consts import ErrorMessages
from exceptions import UnprocessableEntity


class EmailTaken(UnprocessableEntity):
    DETAIL = ErrorMessages.EMAIL_TAKEN
