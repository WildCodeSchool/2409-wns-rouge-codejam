#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x start_db_container.sh`

# Start a PostgreSQL container for running tests
echo '🔎 Checking for existing "pgtest" container...'
# `docker ps -a` lists all containers (running and stopped)
# `--format '{{.Names}}'` formats the output to show only container names
# `grep -q "^pgtest$"` pipes the container names into `grep` to check if a container exactly named "pgtest" already exists
if docker ps -a --format '{{.Names}}' | grep -q "^pgtest$"; then
  echo '🧹 Removing "pgtest" container...'
  # `/dev/null 2>&1` redirects `stderr` and `stdout` outputs to keep the terminal clean
  if docker rm --force pgtest > /dev/null 2>&1; then
    echo '✅ Container "pgtest" successfully removed.'
  else
    echo '❌ Failed to remove container!'
    exit 1
  fi
else
  echo 'ℹ️ No existing "pgtest" container found. Skipping removal.'
fi

echo '🚀 Starting PostgreSQL container...'
if docker run -d -p 5434:5432 --name pgtest -e POSTGRES_PASSWORD=test postgres > /dev/null 2>&1; then
  echo '✅ PostgreSQL is running on port 5434.'
else
  echo '❌ Failed to start PostgreSQL container!'
  exit 1
fi
