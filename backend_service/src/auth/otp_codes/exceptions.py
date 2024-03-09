from fastapi import status
from src.auth.otp_codes.consts import ErrorMessages
from src.exceptions import UnprocessableEntity


class OtpCodeIsNotValid(UnprocessableEntity):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = ErrorMessages.OTP_CODE_IS_NOT_VALID
