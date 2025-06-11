#!/bin/bash

# Script to test SSH connection to EC2 instance

# Set default values
EC2_HOST=""
EC2_USERNAME="ubuntu"
SSH_KEY_PATH=""

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

echo "Testing SSH connection to $EC2_HOST as $EC2_USERNAME..."

# Add host to known_hosts to avoid prompts
ssh-keyscan -H "$EC2_HOST" >> ~/.ssh/known_hosts 2>/dev/null

# Test SSH connection with verbose output
ssh -v -i "$SSH_KEY_PATH" "$EC2_USERNAME@$EC2_HOST" "echo 'SSH connection successful'; uname -a; id"

# Check if connection was successful
if [ $? -eq 0 ]; then
  echo "SSH connection test completed successfully!"
else
  echo "SSH connection test failed. Please check the error messages above."
  exit 1
fi