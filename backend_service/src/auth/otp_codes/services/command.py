from src.redis import redis_storage
from random import randint
from src.auth.otp_codes.domain import OtpCode
from src.auth.otp_codes.consts import OTP_CODE_LIFETIME, OTP_CODE_REDIS_KEY_PREFIX


class OtpCodeCommand:
    def _generate_code(self) -> int:
        return randint(100000, 999999)

    async def create_for_email(self, email: str) -> OtpCode:
        code = self._generate_code()
        await redis_storage.setex(
            f'{OTP_CODE_REDIS_KEY_PREFIX}:{email}',
            OTP_CODE_LIFETIME,
            code
        )

        return OtpCode(email=email, code=code)

    async def delete_for_email(self, email: str) -> None:
        await redis_storage.delete(f'{OTP_CODE_REDIS_KEY_PREFIX}:{email}')
