start:
	docker compose up

stop:
	docker compose down

start_dev:
	docker compose up db db_test redis
