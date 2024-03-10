from httpx import AsyncClient
from pytest_mock import MockerFixture

from src.users.models import UserModel


async def test_valid_case(client: AsyncClient, mocker: MockerFixture):
    auth_token = "auth_token"
    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=auth_token)
    )

    response = await client.post(
        "/api/v1/authorization/registration",
        json={"email": "email@register.ru", "name": "test name", "password": "Strong_Password1"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200

    jwt_token = response.json()
    assert jwt_token['access_token']
    assert jwt_token['refresh_token']

    redis_get_mock.assert_called_once()


async def test_email_already_exists(client: AsyncClient, test_user: UserModel):
    auth_token = "auth_token"

    response = await client.post(
        "/api/v1/authorization/registration",
        json={"email": test_user.email, "name": "test name", "password": "Strong_Password1"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 422
    assert response.json() == {"detail": "Email is already taken."}


async def test_weak_password(client: AsyncClient, mocker: MockerFixture):
    auth_token = "auth_token"

    response = await client.post(
        "/api/v1/authorization/registration",
        json={"email": "email@register.ru", "name": "test name", "password": "weak"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 422
