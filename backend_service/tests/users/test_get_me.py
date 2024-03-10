from httpx import AsyncClient

from src.users.models import UserModel


async def test_valid_case(auth_client: AsyncClient, test_user: UserModel):
    response = await auth_client.get(
        "/api/v1/users/me"
    )
    assert response.status_code == 200
    user_data = response.json()

    assert user_data['id'] == str(test_user.id)
    assert user_data['email'] == test_user.email
    assert user_data['name'] == test_user.name


async def test_not_auth(client: AsyncClient):
    response = await client.get(
        "/api/v1/users/me"
    )
    assert response.status_code == 403  # mb 401?
    assert response.json() == {"detail": "Not authenticated"}
