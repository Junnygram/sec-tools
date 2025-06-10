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
- Use these tools responsibly and ethically