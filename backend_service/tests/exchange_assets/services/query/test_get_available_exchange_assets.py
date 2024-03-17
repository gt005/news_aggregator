import json
import httpx
from pytest_mock import MockerFixture
from src.exchange_assets.services.query import ExchangeAssetsQuery
from httpx import Response


async def test_valid_case(mocker: MockerFixture):
    with open('tests/exchange_assets/moex_responses/available_assets.json') as f:
        mock_response_content = json.load(f)

    url = 'https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json'
    request = httpx.Request('GET', url)
    mock_response = httpx.Response(200, json=mock_response_content, request=request)
    
    mocker.patch('httpx.AsyncClient.get', return_value=mock_response)

    resutl = await ExchangeAssetsQuery().get_available_exchange_assets()

    assert len(resutl) > 0
