#!/usr/bin/env bash
# Make sure to add permissions to execute this file by running `chmod +x restore_db.sh`

# Restore database in the running container by dropping existing tables and initializing from a SQL dump file
echo '🔎 Checking for existing "codejam-db" container...'
if docker ps --format '{{.Names}}' | grep -q "^codejam-db$"; then
  # Drop tables in the running database container
  echo '🧹 Dropping database tables...'
  if docker exec -i codejam-db psql -U codejam -d codejam < ./database/drop.sql; then
    echo '✅ Tables successfully dropped.'
    
    # Create tables in the running database container
    if docker exec -i codejam-db psql -U codejam -d codejam < ./database/create.sql; then
      echo '✅ Tables successfully created.'
      
      # Initialize tables in the running database container from an SQL dump file 
      echo '🚀 Initializing database from SQL dump file...'
      if docker exec -i codejam-db psql -U codejam -d codejam < ./database/dump.sql > /dev/null 2>&1; then
        echo '✅ Database successfully initialized.'
      else
        echo '❌ Failed to initialize database!'
        exit 1
      fi

    else
      echo '❌ Failed to create tables!'
      exit 1
    fi

  else
    echo '❌ Failed to drop tables!'
    exit 1
  fi

else
  echo 'ℹ️ ❌ No existing or running "codejam-db" container!'
  exit 1
fi
