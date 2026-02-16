variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "GCP region for Cloud Run deployment"
}

variable "industry" {
  type        = string
  description = "Industry/tenant identifier (e.g., cultivos, vending)"
}

variable "image" {
  type        = string
  description = "Full Docker image URL including tag"
}

variable "repository_id" {
  type        = string
  default     = "demeter-frontend"
  description = "Artifact Registry repository ID"
}

variable "github_owner" {
  type        = string
  default     = ""
  description = "GitHub repository owner (for Cloud Build trigger)"
}

variable "github_repo" {
  type        = string
  default     = ""
  description = "GitHub repository name (for Cloud Build trigger)"
}

variable "github_branch" {
  type        = string
  default     = "main"
  description = "Branch to trigger builds on"
}

# Auth0 configuration (passed as build substitutions)
variable "auth0_domain" {
  type        = string
  description = "Auth0 domain"
}

variable "auth0_client_id" {
  type        = string
  sensitive   = true
  description = "Auth0 client ID"
}

variable "auth0_audience" {
  type        = string
  description = "Auth0 API audience"
}

variable "api_url" {
  type        = string
  description = "Backend API URL"
}

variable "default_tenant_id" {
  type        = string
  default     = "go-bar"
  description = "Default tenant ID when not resolved from subdomain/path"
}
