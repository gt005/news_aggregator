from fastapi import APIRouter
from src.auth.otp_codes.services.query import OtpCodeQuery
from src.auth.otp_codes.exceptions import OtpCodeIsNotValid
from src.auth.authorization.services.command import AuthorizationTokenCommand
from src.auth.otp_codes.domain import OtpCode
from src.auth.authorization.domain import AuthorizationToken
from src.email.sender import EmailSender
from src.auth.otp_codes.schemas import SendOtpCodeSchema
from src.auth.otp_codes.services.command import OtpCodeCommand


otp_codes_v1_router = APIRouter(tags=["otp_codes"])


@otp_codes_v1_router.post("/send-code", response_model=None, status_code=204)
async def send_code(
    send_otp_code_schema: SendOtpCodeSchema,
) -> None:
    otp_code = await OtpCodeCommand().create_for_email(email=send_otp_code_schema.email)

    await EmailSender.send_otp_code(
        to_email=otp_code.email,
        code=otp_code.code
    )


@otp_codes_v1_router.post("/verify-code")
async def verify_code(
    verify_otp_code_schema: OtpCode,
) -> AuthorizationToken:
    otp_code = await OtpCodeQuery().get_by_email(email=verify_otp_code_schema.email)

    if otp_code is None or otp_code.code != verify_otp_code_schema.code:
        raise OtpCodeIsNotValid()

    authorization_token = await AuthorizationTokenCommand().create_for_email(
        email=verify_otp_code_schema.email
    )

    await OtpCodeCommand().delete_for_email(email=verify_otp_code_schema.email)

    return authorization_token
