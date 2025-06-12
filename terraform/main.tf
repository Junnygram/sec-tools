provider "aws" {
  region = var.aws_region
}



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

  user_data = "#!/bin/bash\napt-get update -y\napt-get install -y docker.io\nsystemctl start docker\nsystemctl enable docker\nusermod -a -G docker ubuntu\nmkdir -p /home/ubuntu/sec-tools\nchown ubuntu:ubuntu /home/ubuntu/sec-tools"

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

