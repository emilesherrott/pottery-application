#!/bin/bash
set -e

services=("java-logger" "pottery-api" "pottery-db" "pottery-python")

for service in "${services[@]}"; do
  echo "🔨 Building $service..."
  docker build -t "emilesherrott/${service}:latest" "./${service}"
done

echo "Images built successfully."
