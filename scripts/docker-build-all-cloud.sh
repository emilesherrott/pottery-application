#!/bin/bash
set -e

# Move to the project root (one level above the script)
cd "$(dirname "$0")/.."

services=("java-logger" "pottery-api" "pottery-db" "pottery-python")

echo "🔑 Logging in to Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

for service in "${services[@]}"; do
  echo "🔨 Building $service for amd64..."
  docker build --platform linux/amd64 -t "${DOCKER_USERNAME}/${service}-cloud:latest" "./${service}"

  echo "🚀 Pushing $service to Docker Hub..."
  docker push "${DOCKER_USERNAME}/${service}-cloud:latest"
done

echo "✅ All images built and pushed successfully."
