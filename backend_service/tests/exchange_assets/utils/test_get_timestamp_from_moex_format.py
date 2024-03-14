from datetime import datetime

from src.exchange_assets.utils import get_timestamp_from_moex_format


def test_get_timestamp_from_moex_format():
    date = '2021-01-01 00:00:00'
    assert get_timestamp_from_moex_format(date) == datetime(2021, 1, 1, 0, 0, 0)
