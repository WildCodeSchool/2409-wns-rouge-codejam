#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x seed_db.sh`

# echo "Initializing database from SQL dump file..."

# Initialize tables in the running database container from an SQL dump file 
echo '🚀 Initializing database from SQL dump file...'
if docker exec -i codejam-db psql -U codejam -d codejam < ./database/dump.sql > /dev/null 2>&1; then
  echo '✅ Database successfully initialized.'
else
  echo '❌ Failed to initialize database!'
  exit 1
fi