#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x init_db.sh`

echo "Dropping database tables..."

# Drop database tables in the running database container
(docker exec -i codejam-db psql -U codejam -d codejam < ./database/drop.sql && echo "✅Database tables dropped successfully!") || echo "❌Database table drop failed!"

echo "Initializing database from SQL dump file..."

# Initialize tables in the running database container from an SQL dump file 
(docker exec -i codejam-db psql -U codejam -d codejam < ./database/dump.sql && echo "✅Database initialized successfully!") || echo "❌Database restoration failed!"