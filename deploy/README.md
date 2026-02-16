# Deployment Guide - GCP Cloud Run

## Prerequisites

1. **GCP Project** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Terraform** >= 1.5.0 (optional, for IaC)
4. **Auth0 Application** configured for your domain

## Quick Start (Manual)

### 1. Initial Setup

```bash
# Set your project
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# Run the setup script
./deploy/setup-gcp.sh
```

### 2. Build and Push Image

```bash
# Authenticate to Artifact Registry
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev

# Build with production config
docker build \
  --build-arg VITE_API_URL="https://api.demeter.app" \
  --build-arg VITE_AUTH0_DOMAIN="your-tenant.auth0.com" \
  --build-arg VITE_AUTH0_CLIENT_ID="your-client-id" \
  --build-arg VITE_AUTH0_AUDIENCE="https://api.demeter.app" \
  --build-arg VITE_AUTH0_CALLBACK_URL="https://your-app.demeter.app/callback" \
  -t ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/demeter-frontend/frontend:latest \
  .

# Push to Artifact Registry
docker push ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/demeter-frontend/frontend:latest
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy frontend \
  --image ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/demeter-frontend/frontend:latest \
  --region ${GCP_REGION} \
  --platform managed \
  --allow-unauthenticated \
  --cpu 1 \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 5
```

## CI/CD with Cloud Build

### Option A: Manual Trigger

```bash
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --substitutions=_INDUSTRY=cultivos,_VITE_AUTH0_CLIENT_ID=your-client-id
```

### Option B: Automatic Triggers (via Terraform)

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

## Terraform Deployment

### 1. Configure Variables

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
project_id      = "your-gcp-project"
region          = "us-central1"
industry        = "cultivos"
image           = "us-central1-docker.pkg.dev/your-project/demeter-frontend/cultivos-frontend:latest"
auth0_domain    = "your-tenant.auth0.com"
auth0_client_id = "your-client-id"
auth0_audience  = "https://api.demeter.app"
api_url         = "https://api.demeter.app"
```

### 2. Deploy

```bash
terraform init
terraform plan
terraform apply
```

## Runtime Configuration Override

You can override build-time configuration at runtime without rebuilding:

```bash
gcloud run services update frontend \
  --region ${GCP_REGION} \
  --set-env-vars "RUNTIME_API_URL=https://new-api.demeter.app"
```

Available runtime variables:
- `RUNTIME_API_URL`
- `RUNTIME_AUTH0_DOMAIN`
- `RUNTIME_AUTH0_CLIENT_ID`
- `RUNTIME_AUTH0_AUDIENCE`
- `RUNTIME_AUTH0_CALLBACK_URL`
- `RUNTIME_AUTH_BYPASS`
- `RUNTIME_DEFAULT_TENANT_ID`

## Multi-Tenant Deployment

For deploying multiple tenants (industries):

```bash
# Deploy tenant 1
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --substitutions=_INDUSTRY=cultivos,_VITE_AUTH0_CALLBACK_URL=https://cultivos.demeter.app/callback

# Deploy tenant 2
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --substitutions=_INDUSTRY=vending,_VITE_AUTH0_CALLBACK_URL=https://vending.demeter.app/callback
```

## Auth0 Configuration

Add these URLs to your Auth0 Application:

**Allowed Callback URLs:**
```
https://cultivos.demeter.app/callback,
https://vending.demeter.app/callback,
http://localhost:3000/callback
```

**Allowed Logout URLs:**
```
https://cultivos.demeter.app,
https://vending.demeter.app,
http://localhost:3000
```

**Allowed Web Origins:**
```
https://cultivos.demeter.app,
https://vending.demeter.app,
http://localhost:3000
```

## Troubleshooting

### Container fails health check
- Verify nginx is configured with `/health` endpoint
- Check Cloud Run logs: `gcloud run services logs read frontend`

### Auth0 redirect loop
- Verify callback URL matches exactly (including protocol)
- Check Auth0 Application settings for allowed URLs

### CORS errors
- Ensure backend has frontend domain in allowed origins
- Check CSP header in `nginx.cloud-run.conf`

## File Structure

```
deploy/
├── README.md                    # This file
├── setup-gcp.sh                 # Initial GCP setup script
├── cloudbuild.yaml              # Cloud Build pipeline
├── .env.production.example      # Production env template
├── cloudrun/
│   └── frontend-service.yaml    # Knative service spec (reference)
└── terraform/
    ├── versions.tf              # Provider configuration
    ├── variables.tf             # Input variables
    ├── main.tf                  # Resources (Artifact Registry, Cloud Run, Trigger)
    ├── outputs.tf               # Output values
    └── terraform.tfvars.example # Variables template
```
