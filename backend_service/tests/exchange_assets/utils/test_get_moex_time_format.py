from datetime import datetime

from src.exchange_assets.utils import get_moex_time_format


def test_valid_case():
    date = datetime(2021, 1, 1, 0, 0, 0)
    assert get_moex_time_format(date) == '2021-01-01 00:00:00'
