from datetime import datetime
from time import sleep
from typing import List
from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


class NewsItem(BaseModel):
    id: str
    source: str
    title: str
    text: str
    link: str
    dateTime: datetime


class FetchNewsListResult(BaseModel):
    newsList: List[NewsItem]
    hasNextPage: bool


class Folder(BaseModel):
    id: str
    name: str


mock_news = [
    (
        NewsItem(
            id='1',
            source='РБК',
            title='Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 10, 5, 16, 24)
        ),
        NewsItem(
            id='2',
            source='РБК',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 10, 5, 16, 25)
        ),
        NewsItem(
            id='3',
            source='MarketTweets',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 11, 7, 15, 50)
        ),
        NewsItem(
            id='4',
            source='Не рбк',
            title='Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 11, 9, 16, 24)
        ),
        NewsItem(
            id='5',
            source='5',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 11, 15, 16, 25)
        ),
        NewsItem(
            id='6',
            source='6 заголовок',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2024, 11, 7, 15, 50)
        ),
    ),
    (
        NewsItem(
            id='7',
            source='7',
            title='Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 11, 9, 16, 24)
        ),
        NewsItem(
            id='8',
            source='8',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2023, 11, 15, 16, 25)
        ),
        NewsItem(
            id='9',
            source='9 заголовок',
            title='Головная перерегистрировалась в Россию',
            text='Компания была зарегистрирована...',
            link='http://example.com',
            dateTime=datetime(2024, 11, 7, 15, 50)
        ),
    )
]

mock_folders = {
    UUID('8c572005-dca8-481e-ad3a-a9573e8d3a9e'): 'Последние новости',
    UUID('a0981414-eb30-4ced-b751-b0270fb80ec6'): 'Избранное',
    UUID('4fc71eeb-4fcf-4dc3-81e5-51e6e509ff78'): 'Поиск',
}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Разрешите вашему фронтенду доступ
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)


@app.get("/feed")
async def fetch_main_feed_page_news(page: int = 1) -> FetchNewsListResult:
    sleep(1)
    if page == 1:
        return FetchNewsListResult(
            newsList=mock_news[0],
            hasNextPage=True
        )
    elif page == 2:
        return FetchNewsListResult(
            newsList=mock_news[1],
            hasNextPage=False
        )

    return HTTPException(status_code=404, detail="Item not found")


@app.get("/folder/me")
async def fetch_folder_menu() -> List[Folder]:
    sleep(1)
    return [
        Folder(id=str(folder_id), name=folder_name)
        for folder_id, folder_name in mock_folders.items()
    ]


@app.get("/folder/{folder_id}")
async def read_folder(folder_id: UUID):
    sleep(1)
    if folder_id in mock_folders:
        return {
            'id': folder_id,
            'name': mock_folders[folder_id],
        }

    return HTTPException(status_code=404, detail="Item not found")


@app.get("/folder/{folder_id}/news")
async def fetch_folder_news(folder_id: UUID, page: int = 1) -> FetchNewsListResult:
    sleep(1)
    if folder_id in mock_folders:
        if page == 1:
            return FetchNewsListResult(
                newsList=mock_news[0],
                hasNextPage=True
            )
        elif page == 2:
            return FetchNewsListResult(
                newsList=mock_news[1],
                hasNextPage=False
            )

    return HTTPException(status_code=404, detail="Item not found")
