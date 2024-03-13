from httpx import AsyncClient
from pytest_mock import MockerFixture


async def test_valid_case(
    client: AsyncClient,
    redis_setex_mock,
    redis_delete_mock,
    mocker: MockerFixture
):
    otp_code = 123_456

    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=otp_code)
    )

    response = await client.post(
        "/api/v1/otp_codes/verify-code",
        json={"email": "test@email.ru", 'code': otp_code}
    )

    assert response.status_code == 200

    redis_setex_mock.assert_called_once()
    redis_get_mock.assert_called_once()
    redis_delete_mock.assert_called_once()


async def test_incorrect_code(client: AsyncClient, redis_setex_mock, mocker: MockerFixture):
    otp_code = 123_456

    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=otp_code)
    )

    response = await client.post(
        "/api/v1/otp_codes/verify-code",
        json={"email": "test@email.ru", 'code': 654_321}
    )

    assert response.status_code == 401

    redis_setex_mock.assert_not_called()
    redis_get_mock.assert_called_once()


async def test_not_valid_email(client: AsyncClient, redis_setex_mock, mocker: MockerFixture):
    otp_code = 123_456

    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=otp_code)
    )

    response = await client.post(
        "/api/v1/otp_codes/verify-code",
        json={"email": "not_email", 'code': otp_code}
    )

    assert response.status_code == 422

    redis_setex_mock.assert_not_called()
    redis_get_mock.assert_not_called()
