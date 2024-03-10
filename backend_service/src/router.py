from fastapi import APIRouter

from src.auth.authorization.routers import authorization_v1_router
from src.auth.otp_codes.router import otp_codes_v1_router
from src.folders.router import folders_v1_router
from src.news.router import news_v1_router
from src.users.router import user_v1_router


router_v1 = APIRouter()

router_v1.include_router(news_v1_router, prefix='/news')
router_v1.include_router(otp_codes_v1_router, prefix='/otp_codes')
router_v1.include_router(authorization_v1_router, prefix='/authorization')
router_v1.include_router(user_v1_router, prefix='/users')
router_v1.include_router(folders_v1_router, prefix='/folders')
