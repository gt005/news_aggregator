from datetime import datetime

from pydantic import BaseModel


class ExchangeAsset(BaseModel):
    ticker: str
    name: str


class AssetCandle(BaseModel):
    open: float
    close: float
    high: float
    low: float
    value: float
    volume: float
    begin: datetime
    end: datetime
