# GitHub Actions Workflow for EC2 Deployment

This workflow automates the deployment of the Security Tools Suite to an EC2 instance.

## Prerequisites

Before using this workflow, you need to set up the following GitHub secrets:

1. `AWS_ACCESS_KEY_ID`: Your AWS access key ID
2. `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
3. `EC2_HOST`: The public IP or DNS of your EC2 instance
4. `EC2_USERNAME`: The username to SSH into your EC2 instance (default: ec2-user)
5. `SSH_PRIVATE_KEY`: Your private SSH key to connect to the EC2 instance

## Optional GitHub Variables

1. `AWS_REGION`: The AWS region where your EC2 instance is located (default: us-east-1)

## How It Works

1. The workflow is triggered on pushes to the main branch or manually
2. It sets up SSH access to your EC2 instance
3. Copies the project files to the EC2 instance
4. Installs Docker and Docker Compose if not already installed
5. Builds and starts the containers using docker-compose
6. Outputs the URLs to access the application

## Manual Deployment

You can manually trigger this workflow from the GitHub Actions tab in your repository.

## EC2 Instance Setup

Make sure your EC2 instance:
1. Has sufficient permissions (security group) to allow inbound traffic on ports 3000 and 8080
2. Has enough resources to run Docker containers (recommended: t2.small or larger)
3. Is running Amazon Linux 2 or a compatible Linux distribution