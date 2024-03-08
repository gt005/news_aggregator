async def test_tmp(client):
    response = await client.get("api/v1/news/")
    assert response.status_code == 200
    assert response.json() == {'items': [], 'total': 0, 'page': 1, 'size': 50, 'pages': 0}
