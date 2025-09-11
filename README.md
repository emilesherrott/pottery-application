# 3-Microserivce-Repo

## Application Overview

This repository hosts a microservices-based application designed for the pottery ecosystem, serving both **Potters** and **Customers**.

- **For Potters**:  
  Potters can create and manage their ceramic pieces, track their inventory, and visualise sales and pricing data through interactive dashboards. The application provides insights into their production and sales trends, helping potters optimise their offerings.

- **For Customers**:  
  Customers can browse available pottery pieces, view pricing, and make purchases from multiple potters. The platform ensures a seamless shopping experience while supporting the growth of independent pottery creators.

The system leverages multiple microservices, including APIs for inventory management, sales processing, and data visualisation, with a centralised PostgreSQL database and Dockerised deployment for development, testing, and production environments.


## DEVELOPMENT

### Manual Docker Build

- There's a shell script at the root of the repository called: `docker-build-all.sh`
- Update your privlages in order to execute script: `chmod +x docker-build-all.sh`
- From the root of the repository run: `./docker-build-all.sh` to build all Docker images
- Executing `docker-compose up` at the root of the directory will trigger the corresponding **docker-compose.yml** file and launch the application locally. 
  - A seperate **docker-compose.yml** file is located inside the **./configuration** folder which is utilised for production using the provisioned infrastructures correct platform. 

## Pipeline Automation 

If desired there's the potential to apply configuration to this repository to automate the building and pushing of Docker Images through an **AWS CodePipeline** and **AWS CodeBuild** project. 

**AWS CodeBuild** utilises the **docker-build.yml** file defined inside **./configuration** file. The phases within this file build the 4 seperate microservices for cloud architecture with both the tag of **latest** and the **build number**. 

### Secret Mananger

To automate this you'll need to add a secret to **AWS's Secret Mananger** resource. 

- Create a secret named: **pipeline-docker-credentials**
- With two keys:
  -  **username** - value: your Docker username
  - **password** - value: your Docker password

# Testing

Unit Tests and Integration Tests have been written for the **pottery-api** service. 

## Unit Tests

To execute the unit tests:
- navigate to: **./pottery-api** and run: `npm i` to install dependencies
- run: `npm run unitTests`

## Integration Tests

A limited amount of integrations tests have been written. Instead of using a SAAS Platform, the DB the integrationt tests run against is from a local Docker Container. 

To build the Image for testing from: **./pottery-api/__tests__/integration/config**, run: `docker build -t emilesherrott/pottery-db-test:latest .`


You can then start the container by running: `chmod +x start-test-db.sh` and then  `./start-test-db.sh` from **./scripts**

# Production

## Manual Docker Build

If you haven't established an AWS Pipeline to automate the building of Docker Images from **./scripts** you can execute: `docker-build-all-cloud.sh`

- **NOTE**: You'll need to define environment variables for:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  For this to work. 

## Terraform

The terraform configuration defined inside **./terraform** provisions several EC2 instances to host our API with ingress to allow HTTP traffic. These instances are geographically seperated through the availability-zones in **us-east-1**. Traffic will reach the API through a provisioned **Load Balanacer**.

Additionally it'll create an additional EC2 instance which will host our **PostgreSQL** DB. 

Traffic will be seperated through the load balancer to reach to API. All requests from the API will then access a central DB. 

- Provisioning the configured infrastructure is reliant on a data provider to access **subnet** information from the default **VPC** in **us-east-1**. 
- To provision resources:
  1. `cd` into the `./terraform` directory
  2. run: `terraform init`
  3. run: `terraform apply -target=data.aws_subnets.default_subnets`
  4. run: `terraform apply`

### Outputs

There's a series of terraform outputs which in production we wish to make use of. 

#### FRONTEND FETCH REQUESTS

The frontend can make it's fetch requests to the provisioned elastic load balancer. In order to configure this:
- After running `terraform apply` run from **./scripts**:

- Run: `chmod +x configure-cli-elb.sh`
- Run: `./configure-cli-elb.sh`

To change the DB HOST to the private IP address of the EC2 instance, within **./script**:
- Run: `chmod +x update-docker-compose-with-private-ip.sk`
- Run: `update-docker-compose-with-private-ip.sh`

This script access the output and then creates a **/modules/config.js** file with a variable defined. 

In the frontend HTML you'll notice a `<script type="module" src="./scripts/modules/index.js" defer></script>` which allows this variable to be utilised.

This variable is imported into the corresponding Javascript files and if this variable exists chooses the address of the Elastic Load Balancer, otherwise it'll use LocalHost instead. 
 

#### ANSIBLE INVENTORY

From this stage we need to configure the Ansible Inventory. Located in **./ansible/inventory.ini**

- Inside the group **[api]** place the Terraform output: **http_server_public_dns** removing the quotes.
- Inside the group **[db]** place the Terraform output: **db_server_public_dns** removing the quotes. 

The final output should look similar to the following:

```
[api]
ec2-52-91-167-16.compute-1.amazonaws.com
ec2-50-19-35-177.compute-1.amazonaws.com
ec2-54-160-91-77.compute-1.amazonaws.com
ec2-3-236-77-155.compute-1.amazonaws.com
ec2-3-94-126-151.compute-1.amazonaws.com
ec2-98-82-21-112.compute-1.amazonaws.com

[db]
ec2-100-27-49-138.compute-1.amazonaws.com
```

### ANSIBLE

To deploy the **DB** onto the EC2 instance and then copy over and execute the **docker-compose.yml** file onto the other EC2 Instances:
- From the root of the repo, run: `cd ansible`
- Run: `ansible-playbook playbooks/execute-docker.yml`

The defeault health checks being executed on the Elastic Load Balancer often lead to a delay of roughly 4 minutes before the application is accessible. 


## Using the application

To see the application running it's recommended that you:
1. Create an account as a Potter
2. Sign in with your account
3. Generate several pottery pieces with different styles
4. Log out and create an account / sign in with a Customer account
5. 'Purchase' different amounts of pottery pieces from the potter account created in stages: 1-3
6. Sign back in as the Potter
7. Click the button to visualise data