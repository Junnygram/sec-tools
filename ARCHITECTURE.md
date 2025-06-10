# Security Tools Suite - Architecture Overview

## System Architecture

The Security Tools Suite follows a modern microservices architecture with a clear separation between frontend and backend components.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Client       │────▶│    Frontend     │────▶│    Backend      │
│    Browser      │     │    Next.js      │     │    Golang API   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  External APIs  │
                                               │  & Services     │
                                               │                 │
                                               └─────────────────┘
```

## Infrastructure Architecture

When deployed to AWS, the system utilizes the following infrastructure components:

```
┌─────────────────────────────────────────────────────────────────┐
│ AWS Cloud                                                       │
│                                                                 │
│   ┌─────────────────┐        ┌─────────────────────────────┐    │
│   │                 │        │                             │    │
│   │  EC2 Instance   │        │  S3 Bucket                  │    │
│   │                 │        │  (Terraform State)          │    │
│   └────────┬────────┘        └─────────────────────────────┘    │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                           │
│   │  Docker         │                                           │
│   │  ┌───────────┐  │                                           │
│   │  │ Frontend  │  │                                           │
│   │  │ Container │  │                                           │
│   │  └───────────┘  │                                           │
│   │  ┌───────────┐  │                                           │
│   │  │ Backend   │  │                                           │
│   │  │ Container │  │                                           │
│   │  └───────────┘  │                                           │
│   └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline

The CI/CD pipeline automates the deployment process:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Code Push  │────▶│  Terraform  │────▶│  Docker     │────▶│  Deploy to  │
│  to GitHub  │     │  Apply      │     │  Build      │     │  EC2        │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Component Architecture

### Backend (Golang)

The backend follows a clean architecture pattern:

```
backend/
├── cmd/
│   └── api/
│       └── main.go       # Application entry point
└── pkg/
    ├── username/         # Username checker module
    ├── whois/            # WHOIS lookup module
    ├── dns/              # DNS lookup module
    ├── ssl/              # SSL certificate checker module
    ├── port/             # Port scanner module
    └── phishing/         # Phishing detector module
```

### Frontend (Next.js)

The frontend follows Next.js app directory structure:

```
frontend/
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

## Data Flow

1. User submits a request through the frontend UI
2. Frontend sends API request to backend
3. Backend processes the request:
   - For username checks: Queries multiple external services
   - For WHOIS: Queries WHOIS servers with fallback mechanisms
   - For DNS: Performs DNS lookups for various record types
   - For SSL: Establishes TLS connection and analyzes certificate
   - For port scanning: Performs concurrent TCP connection attempts
4. Backend returns structured data to frontend
5. Frontend renders results in user-friendly format

## Security Considerations

- All communication between frontend and backend uses HTTPS in production
- Rate limiting implemented to prevent abuse
- Input validation on both frontend and backend
- Containerization provides isolation between components
- Infrastructure provisioned with least privilege principle