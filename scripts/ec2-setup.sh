#!/bin/bash

# EC2 instance setup script for Security Tools Suite
# This script prepares an EC2 instance for running the application

# Update system packages
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker $USER
sudo systemctl enable docker

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create directory for application
echo "Creating application directory..."
mkdir -p ~/sec-tools

echo "EC2 instance setup complete!"
echo "You can now deploy the application using GitHub Actions."
echo "Make sure to set up the required GitHub secrets for deployment."