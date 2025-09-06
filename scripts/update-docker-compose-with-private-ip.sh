#!/bin/bash
set -euo pipefail

# Path to your docker-compose file
DOCKER_COMPOSE_FILE="../ansible/docker-compose.yml"

# Get DB private IP from Terraform
DB_IP=$(terraform -chdir=../terraform output -raw db_server_private_ip)

# Replace the placeholder in the docker-compose.yml
sed -i.bak "s/DB_PRIVATE_IP/$DB_IP/" "$DOCKER_COMPOSE_FILE"

echo "✅ Updated $DOCKER_COMPOSE_FILE with DB_HOST=$DB_IP"