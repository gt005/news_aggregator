from datetime import datetime
from httpx import AsyncClient

from src.exchange_assets.utils import get_moex_time_format, get_timestamp_from_moex_format
from src.exchange_assets.domain import AssetCandle, ExchangeAsset


class ExchangeAssetsQuery:
    async def get_available_exchange_assets(self) -> list[ExchangeAsset]:
        async with AsyncClient() as client:
            avilable_assets = await client.get(
                'https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json',
            )

        avilable_assets.raise_for_status()

        data = avilable_assets.json()['securities']['data']

        domain_assets = [ExchangeAsset(ticker=item[0], name=item[9]) for item in data]

        return domain_assets

    async def get_candles_interval_for_ticker(
        self,
        exchange_asset_ticker: str,
        start_time: datetime,
        end_time: datetime,
        interval: int
    ) -> list[AssetCandle]:
        '''
        https://iss.moex.com/iss/engines/stock/markets/shares/securities/SBER/candles.json?from=2021-01-01&interval=24
        '''
        async with AsyncClient() as client:
            candles = await client.get(
                'https://iss.moex.com/iss/engines/stock/'
                f'markets/shares/securities/{exchange_asset_ticker}/candles.json',
                params={
                    'from': get_moex_time_format(start_time),
                    'till': get_moex_time_format(end_time),
                    'interval': interval
                }
            )

        candles.raise_for_status()

        data = candles.json()['candles']['data']

        domain_candles = [
            AssetCandle(
                open=item[0],
                close=item[1],
                high=item[2],
                low=item[3],
                value=item[4],
                volume=item[5],
                begin=get_timestamp_from_moex_format(item[6]),
                end=get_timestamp_from_moex_format(item[7])
            ) for item in data
        ]

        return domain_candles
