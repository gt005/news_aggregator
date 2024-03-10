from httpx import AsyncClient
from pytest_mock import MockerFixture
from tests.consts import TEST_USER_DATA
from src.users.models import UserModel


async def test_valid_case(client: AsyncClient, test_user: UserModel):
    response = await client.post(
        '/api/v1/authorization/login',
        json={"email": TEST_USER_DATA['email'], 'password': TEST_USER_DATA['password']}
    )

    assert response.status_code == 200

    jwt_token = response.json()
    assert jwt_token['access_token']
    assert jwt_token['refresh_token']


async def test_not_password_incorrect(client: AsyncClient, test_user: UserModel):
    response = await client.post(
        '/api/v1/authorization/login',
        json={"email": TEST_USER_DATA['email'], 'password': 'incorrect_password'}
    )

    assert response.status_code == 401


async def test_not_valid_email(client: AsyncClient, test_user: UserModel):
    response = await client.post(
        '/api/v1/authorization/login',
        json={"email": 'not_email', 'password': TEST_USER_DATA['password']}
    )

    assert response.status_code == 422


async def test_user_not_exists(client: AsyncClient, test_user: UserModel):
    response = await client.post(
        '/api/v1/authorization/login',
        json={"email": 'not_exists@email.ru', 'password': TEST_USER_DATA['password']}
    )

    assert response.status_code == 401
