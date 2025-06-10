terraform {
  backend "s3" {

    bucket = "security-tools-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}