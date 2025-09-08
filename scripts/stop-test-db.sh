#!/bin/bash
set -e

CONTAINER_NAME=pottery-db-test

echo "Stopping test DB container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true
