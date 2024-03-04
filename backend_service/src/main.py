from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import router_v1 as api_router_v1


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # For dev only TODO: make flags for dev and prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router_v1, prefix='/api/v1')
