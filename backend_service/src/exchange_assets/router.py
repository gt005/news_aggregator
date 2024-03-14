from datetime import datetime
from fastapi import APIRouter

from src.exceptions import BadRequest
from src.exchange_assets.services.query import ExchangeAssetsQuery
from src.exchange_assets.domain import ExchangeAsset, AssetCandle


exchange_assets_v1_router = APIRouter(tags=["exchange_assets"])


@exchange_assets_v1_router.get("/assets")
async def get_available_exchange_assets() -> list[ExchangeAsset]:
    return await ExchangeAssetsQuery().get_available_exchange_assets()


@exchange_assets_v1_router.get("/assets/{exchange_asset_ticker}")
async def get_candles_by_ticker_and_interval(
    exchange_asset_ticker: str,
    start_time: str,
    end_time: str,
    interval: str
) -> list[AssetCandle]:
    start_datetime = datetime.fromisoformat(start_time)
    end_datetime = datetime.fromisoformat(end_time)

    if start_datetime > end_datetime:
        raise BadRequest()

    return await ExchangeAssetsQuery().get_candles_interval_for_ticker(
        exchange_asset_ticker=exchange_asset_ticker,
        start_time=start_datetime,
        end_time=end_datetime,
        interval=interval
    )
