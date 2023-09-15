migration-generate:
	docker exec -i api-server npm run migration:generate
migration-run:
	docker exec -i api-server npm run migration:run
migration-revert:
	docker exec -i api-server npm run migration:revert
db-dump:
	docker exec -i rec_book_bot_database pg_dump -U postgres rec_book_bot_database > ./dumpdb/dump.sql
db-restore:
	docker exec -i rec_book_bot_database psql -U postgres rec_book_bot_database < ./dumpdb/dump.sql