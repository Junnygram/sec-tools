## Resources Created

- EC2 instance for running the application
- Security group with required ports (22, 3000, 8080)
- Elastic IP for stable public IP address
- User data script to install Docker and Docker Compose

## Usage

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed locally
3. S3 bucket for Terraform state (optional)

### Local Deployment

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -out=tfplan

# Apply the changes
terraform apply tfplan

# To destroy the infrastructure
terraform destroy
```

### Remote State (S3)

To use S3 for state storage:

1. Create an S3 bucket manually or uncomment the S3 bucket resource in main.tf
2. Update the backend configuration in backend.tf
3. Run `terraform init` with backend config:

```bash
terraform init -backend-config="bucket=your-bucket-name" \
               -backend-config="key=terraform.tfstate" \
               -backend-config="region=us-east-1"
```

## Variables

| Name          | Description                    | Default                                |
| ------------- | ------------------------------ | -------------------------------------- |
| aws_region    | AWS region to deploy resources | us-east-1                              |
| ami_id        | AMI ID for EC2 instance        | ami-0230bd60aa48260c6 (Amazon Linux 2) |
| instance_type | EC2 instance type              | t2.small                               |
| key_name      | Name of the SSH key pair       | security-tools-key                     |
| environment   | Environment name               | dev                                    |

## Outputs

- `ec2_public_ip`: Public IP address of the EC2 instance
- `frontend_url`: URL to access the frontend application
- `backend_url`: URL to access the backend API
