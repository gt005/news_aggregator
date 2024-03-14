from datetime import datetime

from src.exchange_assets.services.query import ExchangeAssetsQuery


async def test_valid_case():
    result = await ExchangeAssetsQuery().get_candles_interval_for_ticker(
        exchange_asset_ticker='SBER',
        start_time=datetime(2021, 9, 1, 0, 0),
        end_time=datetime(2021, 9, 2, 0, 0),
        interval=10
    )
    assert len(result) == 83


async def test_not_found_ticker():
    result = await ExchangeAssetsQuery().get_candles_interval_for_ticker(
        exchange_asset_ticker='NOT_SBER',
        start_time=datetime(2021, 9, 1, 0, 0),
        end_time=datetime(2021, 9, 2, 0, 0),
        interval=10
    )
    assert len(result) == 0
