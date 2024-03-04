from fastapi import APIRouter

from src.news.router import news_v1_router


router_v1 = APIRouter()

router_v1.include_router(news_v1_router, prefix='/news')
