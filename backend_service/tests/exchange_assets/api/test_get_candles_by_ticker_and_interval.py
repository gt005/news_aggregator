from datetime import datetime

from httpx import AsyncClient


async def test_valid_case(client: AsyncClient):
    start_time = datetime(2021, 9, 1, 0, 0)
    end_time = datetime(2021, 9, 2, 0, 0)

    start_time_iso = start_time.isoformat()
    end_time_iso = end_time.isoformat()

    response = await client.get(
        '/api/v1/exchange_assets/assets/SBER',
        params={
            'start_time': start_time_iso,
            'end_time': end_time_iso,
            'interval': 10
        }
    )

    assert response.status_code == 200
    assert len(response.json()) == 83


async def test_end_timestamp_less_than_start_timestamp(client: AsyncClient):
    start_time = datetime(2021, 9, 2, 0, 0)
    end_time = datetime(2021, 9, 1, 0, 0)

    start_time_iso = start_time.isoformat()
    end_time_iso = end_time.isoformat()

    response = await client.get(
        '/api/v1/exchange_assets/assets/SBER',
        params={
            'start_time': start_time_iso,
            'end_time': end_time_iso,
            'interval': 10
        }
    )

    assert response.status_code == 400
    assert response.json() == {'detail': 'Bad request'}


async def test_not_found_ticker(client: AsyncClient):
    start_time = datetime(2021, 9, 1, 0, 0)
    end_time = datetime(2021, 9, 2, 0, 0)

    start_time_iso = start_time.isoformat()
    end_time_iso = end_time.isoformat()

    response = await client.get(
        '/api/v1/exchange_assets/assets/NOT_SBER',
        params={
            'start_time': start_time_iso,
            'end_time': end_time_iso,
            'interval': 10
        }
    )

    assert response.status_code == 200
    assert response.json() == []


async def test_invalid_interval(client: AsyncClient):
    start_time = datetime(2021, 9, 1, 0, 0)
    end_time = datetime(2021, 9, 2, 0, 0)

    start_time_iso = start_time.isoformat()
    end_time_iso = end_time.isoformat()

    response = await client.get(
        '/api/v1/exchange_assets/assets/SBER',
        params={
            'start_time': start_time_iso,
            'end_time': end_time_iso,
            'interval': 100
        }
    )

    assert response.status_code == 200
    assert response.json() == []
