terraform {
  backend "s3" {
    # These values will be filled by the GitHub Actions workflow
    bucket = "security-tools-buckett"
    key    = "terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}