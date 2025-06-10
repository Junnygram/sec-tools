FROM golang:1.21-alpine

# Set working directory inside the container
WORKDIR /app

# Copy go.mod for dependency caching
COPY go.mod ./

# Fix the Go version requirement and disable toolchain check
RUN sed -i 's/go 1.24.1/go 1.21/g' go.mod && \
    echo "export GOTOOLCHAIN=auto" >> /etc/profile

# Set environment variable to bypass Go version check
ENV GOTOOLCHAIN=auto

# Download dependencies
RUN go mod download

# Copy backend source code
COPY . .

# Build the Go application
RUN go build -o server ./cmd/api

# Expose the server port
EXPOSE 8080

# Command to run the binary
CMD ["./server"]