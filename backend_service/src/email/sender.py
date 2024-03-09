from settings import settings
import aiosmtplib
from email.message import EmailMessage


class EmailSender:
    @staticmethod
    async def send_otp_code(*, to_email: str, code: int) -> None:
        message = EmailMessage()
        message['From'] = settings.SENDER_EMAIL_OTP_CODES_EMAIL
        message["To"] = to_email
        message["Subject"] = 'Код подтверждения'

        code = str(code)
        message.set_content(f'Ваш код подтверждения: {code[:3]} {code[3:]}')

        await aiosmtplib.send(
            message,
            hostname=settings.SENDER_EMAIL_HOST,
            port=settings.SENDER_EMAIL_PORT,
            use_tls=True,
            username=settings.SENDER_EMAIL_OTP_CODES_EMAIL,
            password=settings.SENDER_EMAIL_HOST_PASSWORD,
        )
