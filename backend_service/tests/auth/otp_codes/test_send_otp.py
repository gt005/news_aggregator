from pytest_mock import MockerFixture
from httpx import AsyncClient


async def test_valid_case(client: AsyncClient, redis_setex_mock, mocker: MockerFixture):
    mocker.patch("src.auth.otp_codes.router.EmailSender.send_otp_code", return_value=None)

    response = await client.post(
        "/api/v1/otp_codes/send-code",
        json={"email": "test@email.ru"}
    )

    assert response.status_code == 204

    redis_setex_mock.assert_called_once()


async def test_incorrect_email(client: AsyncClient, redis_setex_mock, mocker: MockerFixture):
    mocker.patch("src.auth.otp_codes.router.EmailSender.send_otp_code", return_value=None)

    response = await client.post(
        "/api/v1/otp_codes/send-code",
        json={"email": "not_email"}
    )

    assert response.status_code == 422
