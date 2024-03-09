from settings import settings


OTP_CODE_REDIS_KEY_PREFIX = settings.REDIS_KEY_PREFIX + ':otp_code'
OTP_CODE_LIFETIME = settings.OTP_CODE_LIFETIME


class ErrorMessages:
    OTP_CODE_IS_NOT_VALID = "Otp code is not valid or expired."
