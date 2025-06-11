# Security Tools Suite

A full-stack application built with Next.js and Golang that provides various security tools for developers and security professionals.

## Features

### Username Checker
- Check username availability across multiple social media platforms and websites
- Get instant results on where a username is available or already taken

### WHOIS Lookup
- Discover domain registration details, ownership information, and expiration dates
- View raw WHOIS data and structured information

### DNS Lookup
- Check DNS records including A, AAAA, MX, TXT, and NS records
- Analyze domain configuration and DNS setup

### SSL Certificate Checker
- Verify SSL certificate validity and expiration dates
- View certificate details, issuer information, and security status

### Port Scanner
- Scan for open ports on servers and websites
- Identify potential security vulnerabilities and exposed services

## Deployment Options

### EC2 Deployment with GitHub Actions

This project includes a GitHub Actions workflow for automated deployment to an EC2 instance:

1. Set up the required GitHub secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `EC2_HOST`: The public IP or DNS of your EC2 instance
   - `EC2_USERNAME`: The username to SSH into your EC2 instance (default: ec2-user)
   - `SSH_PRIVATE_KEY`: Your private SSH key to connect to the EC2 instance

2. Push to the main branch or manually trigger the workflow from GitHub Actions tab

3. The workflow will:
   - Install Docker and Docker Compose on the EC2 instance if needed
   - Deploy the application using Docker Compose
   - Output the URLs to access the application

For more details, see the [GitHub Actions workflow documentation](.github/workflows/README.md).

### Manual EC2 Setup

If you prefer to set up the EC2 instance manually:

1. Launch an EC2 instance with Amazon Linux 2
2. Run the setup script: `./scripts/ec2-setup.sh`
3. Clone this repository to the EC2 instance
4. Run the application using Docker Compose

## Running the Application Locally

### Using Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

Once running, access the application at http://localhost:3000

### Running Separately

#### Backend (Golang)

```bash
# Navigate to backend directory
cd backend

# Run the application
go run cmd/api/main.go
```

The backend API will be available at http://localhost:8080

#### Frontend (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:3000

## API Endpoints

### Username Checker
```
GET /check?user={username}
```

### WHOIS Lookup
```
GET /whois?domain={domain}
```

### DNS Lookup
```
GET /dns?domain={domain}
```

### SSL Certificate Checker
```
GET /ssl?domain={domain}
```

### Port Scanner
```
GET /port?host={host}&ports={ports}&timeout={timeout}
```
- `ports` (optional): Comma-separated list of ports to scan (e.g., "80,443,8080")
- `timeout` (optional): Timeout in seconds for each port scan (default: 2)

## Project Structure

```
sec-tools/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go       # Main application entry point
│   └── pkg/
│       ├── username/         # Username checker package
│       ├── whois/            # WHOIS lookup package
│       ├── dns/              # DNS lookup package
│       ├── ssl/              # SSL certificate checker package
│       └── port/             # Port scanner package
└── frontend/
    ├── public/               # Static assets
    └── src/
        ├── app/              # Next.js app directory
        │   ├── userchecker/  # Username checker page
        │   ├── whoislookup/  # WHOIS lookup page
        │   ├── dnslookup/    # DNS lookup page
        │   ├── sslchecker/   # SSL checker page
        │   └── portscanner/  # Port scanner page
        └── component/        # React components
            └── lib/          # Utility functions and services
```

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Golang
- **Containerization**: Docker, Docker Compose

## Security Considerations

- The port scanner is designed for educational purposes and security testing
- Always scan only systems you own or have explicit permission to scan
- Some tools may be blocked by firewalls or security measures
- Use these tools responsibly and ethically# sec-tools

## Deployment

### Manual Deployment to EC2

To manually deploy the application to an EC2 instance:

1. Ensure your EC2 instance is running and accessible
2. Make sure you have the SSH private key for the instance
3. Run the deployment script:

```bash
./scripts/deploy.sh --host <EC2_PUBLIC_IP> --key <PATH_TO_SSH_KEY> --user ubuntu
```

Example:
```bash
./scripts/deploy.sh --host ec2-12-34-56-78.compute-1.amazonaws.com --key ~/.ssh/my-key.pem --user ubuntu
```

The script will:
- Connect to your EC2 instance
- Clone the repository
- Build and start the Docker containers
- Display the URLs for accessing the frontend and backend

### Troubleshooting SSH Issues

If you encounter SSH connection issues:

1. Verify that your EC2 security group allows SSH (port 22) traffic
2. Ensure your SSH key has the correct permissions: `chmod 600 your-key.pem`
3. Check that the key pair associated with the EC2 instance matches your local key
4. Try connecting manually to debug: `ssh -i your-key.pem ubuntu@your-ec2-host`
## Infrastructure Management

### Deploying Infrastructure

The infrastructure is deployed automatically when changes are pushed to the `terraform/` directory on the main branch. You can also manually trigger the deployment using the GitHub Actions workflow:

1. Go to your GitHub repository
2. Navigate to Actions > Terraform EC2 Infrastructure
3. Click "Run workflow"
4. Select "apply" from the dropdown menu
5. Click "Run workflow"

### Destroying Infrastructure

To destroy the infrastructure:

1. Go to your GitHub repository
2. Navigate to Actions > Destroy Infrastructure
3. Click "Run workflow"
4. Type "destroy" in the confirmation field
5. Click "Run workflow"

This will:
- Run `terraform destroy` to remove all AWS resources
- Delete the Terraform state file from S3

Alternatively, you can use the "Terraform EC2 Infrastructure" workflow:
1. Go to your GitHub repository
2. Navigate to Actions > Terraform EC2 Infrastructure
3. Click "Run workflow"
4. Select "destroy" from the dropdown menu
5. Click "Run workflow"
## Infrastructure Management

### Deploying Infrastructure

The infrastructure is deployed automatically when changes are pushed to the `terraform/` directory on the main branch. You can also manually trigger the deployment using the GitHub Actions workflow:

1. Go to your GitHub repository
2. Navigate to Actions > Terraform EC2 Infrastructure
3. Click "Run workflow"
4. Select "apply" from the dropdown menu
5. Click "Run workflow"

### Destroying Infrastructure

To destroy the infrastructure:

1. Go to your GitHub repository
2. Navigate to Actions > Terraform EC2 Infrastructure
3. Click "Run workflow"
4. Select "destroy" from the dropdown menu
5. Click "Run workflow"

This will:
- Run `terraform destroy` to remove all AWS resources
- Delete the Terraform state file from S3 after successful destruction