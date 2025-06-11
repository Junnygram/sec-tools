#!/bin/bash

# Security Tools Suite Deployment Script
# This script deploys the application to an EC2 instance

# Set default values
EC2_HOST=""
EC2_USERNAME="ubuntu"
SSH_KEY_PATH=""
REPO_URL="https://github.com/Junnygram/sec-tools.git"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --host)
      EC2_HOST="$2"
      shift 2
      ;;
    --user)
      EC2_USERNAME="$2"
      shift 2
      ;;
    --key)
      SSH_KEY_PATH="$2"
      shift 2
      ;;
    --repo)
      REPO_URL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate required parameters
if [[ -z "$EC2_HOST" ]]; then
  echo "Error: EC2 host is required (--host)"
  exit 1
fi

if [[ -z "$SSH_KEY_PATH" ]]; then
  echo "Error: SSH key path is required (--key)"
  exit 1
fi

# Check if SSH key exists
if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "Error: SSH key file not found at $SSH_KEY_PATH"
  exit 1
fi

# Set proper permissions for SSH key
chmod 600 "$SSH_KEY_PATH"

echo "Deploying to EC2 instance $EC2_HOST as $EC2_USERNAME..."

# Add host to known_hosts to avoid prompts
ssh-keyscan -H "$EC2_HOST" >> ~/.ssh/known_hosts 2>/dev/null

# Deploy to EC2
ssh -i "$SSH_KEY_PATH" "$EC2_USERNAME@$EC2_HOST" << EOF
  echo "Connected to EC2 instance..."
  
  # Clone the repository
  echo "Cloning repository from $REPO_URL..."
  rm -rf ~/sec-tools
  git clone "$REPO_URL" ~/sec-tools
  
  # Navigate to project directory
  cd ~/sec-tools
  
  # Build and start containers
  echo "Building Docker containers..."
  docker-compose build
  
  echo "Starting Docker containers..."
  docker-compose up -d
  
  # Print container status
  docker-compose ps
  
  # Get the public IP address
  PUBLIC_IP=\$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
  echo "Application deployed successfully!"
  echo "Frontend URL: http://\$PUBLIC_IP:3000"
  echo "Backend URL: http://\$PUBLIC_IP:8080"
EOF

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment completed successfully!"
else
  echo "Deployment failed. Please check the error messages above."
  exit 1
fi