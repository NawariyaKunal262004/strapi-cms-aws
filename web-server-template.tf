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

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Security Group
resource "aws_security_group" "web_sg" {
  name = "web-server-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Launch Template
resource "aws_launch_template" "web_server" {
  name_prefix   = "web-server-"
  image_id      = data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"
  
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  
  user_data = base64encode(file("${path.module}/web_server_user_data.sh"))
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "automated-web-server"
    }
  }
}

# Instance from Launch Template
resource "aws_instance" "web_server" {
  launch_template {
    id      = aws_launch_template.web_server.id
    version = "$Latest"
  }
}

output "web_server_ip" {
  value = aws_instance.web_server.public_ip
}

output "web_url" {
  value = "http://${aws_instance.web_server.public_ip}"
}
