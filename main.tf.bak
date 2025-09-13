terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Create new instance with Amazon Linux 2023
resource "aws_instance" "strapi_server_new" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"
  key_name      = "strapi-key"
  
  vpc_security_group_ids = ["sg-012f0914897601022"]
  subnet_id              = "subnet-015d4587679616f2e"
  
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {}))
  
  tags = {
    Name = "strapi-server-new"
  }
}

output "new_instance_ip" {
  value = aws_instance.strapi_server_new.public_ip
}

output "new_instance_dns" {
  value = aws_instance.strapi_server_new.public_dns
}
