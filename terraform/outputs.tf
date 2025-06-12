# Output the public IP of the EC2 instance
output "ec2_public_ip" {
  value = aws_eip.app_eip.public_ip
  description = "The public IP address of the EC2 instance"
}

output "frontend_url" {
  value = "http://${aws_eip.app_eip.public_ip}:3000"
  description = "URL to access the frontend application"
}

output "backend_url" {
  value = "http://${aws_eip.app_eip.public_ip}:8080"
  description = "URL to access the backend API"
}


