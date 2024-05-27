import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.router import router_v1 as api_router_v1


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # For dev only TODO: make flags for dev and prod
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:5173",
        "http://localhost",
        "http://89.223.121.232",
        "news-fusion.ru"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router_v1, prefix='/infra/v1')


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, log_level="info", reload=True)
