start:
	docker compose up --build

stop:
	docker compose down

start_back_dev:
	docker compose up db db_test redis

start_front_dev:
	docker compose up db db_test redis fastapi_backend
