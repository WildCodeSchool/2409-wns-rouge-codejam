#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x init_db.sh`

# Remove the database container after running tests
echo '🧹 Removing "pgtest" container...'
if docker rm --force pgtest > /dev/null 2>&1; then
  echo '✅ Container "pgtest" successfully removed.'
else
  echo '❌ Failed to remove container!'
  exit 1
fi