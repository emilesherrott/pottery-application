#!/bin/bash
set -e

CONTAINER_NAME=pottery-db-test

# Remove existing container if present
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "Removing existing $CONTAINER_NAME container..."
  docker rm -f $CONTAINER_NAME
fi

# Run the container from the prebuilt image
docker run -d \
  --name $CONTAINER_NAME \
  -p 5433:5432 \
  emilesherrott/pottery-db-test:latest

echo "Postgres test container started on port 5433"
