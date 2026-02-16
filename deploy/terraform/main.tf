# Artifact Registry Repository
resource "google_artifact_registry_repository" "frontend" {
  location      = var.region
  repository_id = var.repository_id
  description   = "Demeter frontend Docker images"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }
}

# Cloud Run Service
resource "google_cloud_run_v2_service" "frontend" {
  name     = "${var.industry}-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.image

      ports {
        container_port = 80
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "256Mi"
        }
        cpu_idle = true # Scale to zero
      }

      # Runtime configuration - injected into config.js by entrypoint
      env {
        name  = "RUNTIME_API_URL"
        value = var.api_url
      }
      env {
        name  = "RUNTIME_AUTH0_DOMAIN"
        value = var.auth0_domain
      }
      env {
        name  = "RUNTIME_AUTH0_CLIENT_ID"
        value = var.auth0_client_id
      }
      env {
        name  = "RUNTIME_AUTH0_AUDIENCE"
        value = var.auth0_audience
      }
      env {
        name  = "RUNTIME_DEFAULT_TENANT_ID"
        value = var.default_tenant_id
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 80
        }
        initial_delay_seconds = 0
        timeout_seconds       = 1
        period_seconds        = 3
        failure_threshold     = 3
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 1  # Single instance, no HA
    }

    timeout = "300s"
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image, # Managed by Cloud Build
    ]
  }
}

# Public access
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Cloud Build Trigger (optional - requires GitHub connection)
resource "google_cloudbuild_trigger" "frontend" {
  count    = var.github_owner != "" && var.github_repo != "" ? 1 : 0
  name     = "${var.industry}-frontend-deploy"
  location = var.region

  github {
    owner = var.github_owner
    name  = var.github_repo

    push {
      branch = "^${var.github_branch}$"
    }
  }

  filename = "deploy/cloudbuild.yaml"

  substitutions = {
    _INDUSTRY               = var.industry
    _REGION                 = var.region
    _REPOSITORY             = var.repository_id
    _VITE_API_URL           = var.api_url
    _VITE_AUTH0_DOMAIN      = var.auth0_domain
    _VITE_AUTH0_CLIENT_ID   = var.auth0_client_id
    _VITE_AUTH0_AUDIENCE    = var.auth0_audience
    _VITE_AUTH0_CALLBACK_URL = "https://${var.industry}.demeter.app/callback"
    _VITE_AUTH_BYPASS       = "false"
  }
}
