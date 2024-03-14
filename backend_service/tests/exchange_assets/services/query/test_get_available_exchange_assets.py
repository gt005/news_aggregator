from src.exchange_assets.services.query import ExchangeAssetsQuery


async def test_valid_case():
    resutl = await ExchangeAssetsQuery().get_available_exchange_assets()

    assert len(resutl) > 0
