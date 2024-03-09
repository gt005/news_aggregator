from src.auth.otp_codes.consts import OTP_CODE_REDIS_KEY_PREFIX
from src.auth.otp_codes.domain import OtpCode
from src.redis import redis_storage


class OtpCodeQuery:
    async def get_by_email(self, email: str) -> OtpCode | None:
        code = await redis_storage.get(f'{OTP_CODE_REDIS_KEY_PREFIX}:{email}')

        if code is None:
            return

        return OtpCode(email=email, code=code)
