from httpx import AsyncClient


async def test_valid_case(client: AsyncClient):
    result = await client.get("/api/v1/exchange_assets/assets")

    assert len(result.json()) > 0
