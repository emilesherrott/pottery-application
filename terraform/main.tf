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


resource "aws_default_vpc" "default" {
}


resource "aws_instance" "http_servers" {
    ami = "ami-0f88e80871fd81e91"
    key_name = "default-ec2"
    instance_type = "t2.micro"
    vpc_security_group_ids = [aws_security_group.http_server_sg.id]

    for_each = toset(data.aws_subnets.default_subnets.ids)
    subnet_id = each.value

    tags = {
      name = "http_servers_${each.value}"
    }

    connection {
        type = "ssh"
        host = self.public_ip
        user = "ec2-user"
        private_key = file(var.aws_key_pair)
    }
}

resource "aws_instance" "db_server" {
    ami = "ami-0f88e80871fd81e91"
    key_name = "default-ec2"
    instance_type = "t2.micro"
    vpc_security_group_ids = [aws_security_group.db_server_sg.id]

    subnet_id = data.aws_subnets.default_subnets.ids[0]

    tags = {
      name = "db_servers_${data.aws_subnets.default_subnets.ids[0]}"
    }

    connection {
        type = "ssh"
        host = self.public_ip
        user = "ec2-user"
        private_key = file(var.aws_key_pair)
    }
}


resource "aws_elb" "elb" {
  name = "elb"
  subnets = data.aws_subnets.default_subnets.ids
  security_groups = [aws_security_group.elb_sg.id]
  instances = values(aws_instance.http_servers).*.id
  listener {
    instance_port = 80
    instance_protocol = "http"
    lb_port = 80
    lb_protocol = "http"
  }
}