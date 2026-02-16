#!/bin/bash
# Setup script for GCP infrastructure
# Run once before first deployment

set -euo pipefail

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID environment variable}"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY="demeter-frontend"

echo "Setting up GCP infrastructure for project: $PROJECT_ID"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  --project="$PROJECT_ID"

# Create Artifact Registry repository
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create "$REPOSITORY" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Demeter frontend Docker images" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "Repository already exists"

# Grant Cloud Build permission to deploy to Cloud Run
echo "Configuring IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin" \
  --condition=None \
  --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None \
  --quiet

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a Cloud Build trigger connected to your repository"
echo "2. Set substitution variables in the trigger:"
echo "   _INDUSTRY, _VITE_AUTH0_DOMAIN, _VITE_AUTH0_CLIENT_ID, etc."
echo "3. For secrets, use Secret Manager:"
echo "   gcloud secrets create auth0-client-id --data-file=- <<< 'your-client-id'"
echo ""
