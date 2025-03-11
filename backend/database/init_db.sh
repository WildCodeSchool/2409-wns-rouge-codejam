#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x init_db.sh`

echo "Restoring database from SQL dump file..."

# Execute the SQL dump file in the running database container
(docker exec -i codejam-db psql -U codejam -d codejam < ./database/dump.sql && echo "Database restored successfully!") || echo "Database restoration failed!"