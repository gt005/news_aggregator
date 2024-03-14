from datetime import datetime


def get_moex_time_format(date: datetime) -> str:
    return date.strftime('%Y-%m-%d %H:%M:%S')


def get_timestamp_from_moex_format(date: str) -> datetime:
    return datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
