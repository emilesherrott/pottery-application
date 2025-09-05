# 3-Microserivce-Repo

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



# Production

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

#### DB HOST

Follwing the execution of the `terraform apply` command a series of different outputs will be generated. Most importantly, a **db_server_private_ip** address. This is important to configure the **pottery-api** to access the centralised **pottery-db**. 

The EC2 instance which holds the DB will be accessed through the **docker-compose.yml** file located in: `./configuration/docker-compose.yml`. Configuration for this microservice isn't directly defined here but via the Ansible playbook. 

You need to provide the private IP address as the **DB_HOST value** on **Line 16** within the previously mentioned **docker-compose.yml** file which will allow the API to find and connect to the DB. 

The final output should look similar to the following:

```
DB_HOST: '172.31.75.92'
```

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

## Full Stack

To connect the frontend to the **Elastic Load Balancer** you'll need to find the **Terraform Output** with the value **elb_public_dns**. 


## Using the application

To see the application running it's recommended that you:
1. Create an account as a Potter
2. Sign in with your account
3. Generate several pottery pieces with different styles
4. Log out and create an account / sign in with a Customer account
5. 'Purchase' different amounts of pottery pieces from the potter account created in stages: 1-3
6. Sign back in as the Potter
7. Click the button to visualise data