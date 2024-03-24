from email.message import EmailMessage

import aiosmtplib

from settings import settings
from src.email.templates.const import OTP_CODE_TEMPLATE


class EmailSender:
    @staticmethod
    async def send_otp_code(*, to_email: str, code: int) -> None:
        formated_code = f'{str(code)[:3]} {str(code)[3:]}'

        message = EmailMessage()
        message['From'] = settings.SENDER_EMAIL_OTP_CODES_EMAIL
        message["To"] = to_email
        message["Subject"] = f'{formated_code} - Код подтверждения'

        html_content = OTP_CODE_TEMPLATE.format(code=formated_code)

        message.set_content(f'Ваш код подтверждения: {formated_code}')
        message.add_alternative(html_content, subtype='html')

        await aiosmtplib.send(
            message,
            hostname=settings.SENDER_EMAIL_HOST,
            port=settings.SENDER_EMAIL_PORT,
            use_tls=True,
            username=settings.SENDER_EMAIL_OTP_CODES_EMAIL,
            password=settings.SENDER_EMAIL_HOST_PASSWORD,
        )
