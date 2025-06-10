provider "aws" {
  region = var.aws_region
}

# S3 bucket for Terraform state - commented out as we'll create it manually
# resource "aws_s3_bucket" "terraform_state" {
#   bucket = var.s3_bucket_name
#   force_destroy = true
# }

# EC2 instance for the application
resource "aws_instance" "app_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  
  tags = {
    Name = "SecurityToolsSuite"
    Environment = var.environment
    ManagedBy = "Terraform"
  }

  user_data = <<-EOF
    #!/bin/bash
    # Update system packages
    yum update -y
    
    # Install Docker
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -a -G docker ec2-user
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create app directory
    mkdir -p /home/ec2-user/sec-tools
    chown ec2-user:ec2-user /home/ec2-user/sec-tools
  EOF

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    delete_on_termination = true
  }
}

# Security group for the EC2 instance
resource "aws_security_group" "app_sg" {
  name        = "security-tools-sg"
  description = "Security group for Security Tools Suite"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  # Frontend access
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Frontend"
  }

  # Backend access
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API"
  }

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "security-tools-sg"
    Environment = var.environment
  }
}

# Elastic IP for the EC2 instance
resource "aws_eip" "app_eip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
  
  tags = {
    Name = "security-tools-eip"
    Environment = var.environment
  }
}

