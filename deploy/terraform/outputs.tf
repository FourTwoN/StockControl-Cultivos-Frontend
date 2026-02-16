output "service_url" {
  value       = google_cloud_run_v2_service.frontend.uri
  description = "Cloud Run service URL"
}

output "service_name" {
  value       = google_cloud_run_v2_service.frontend.name
  description = "Cloud Run service name"
}

output "repository_url" {
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.frontend.repository_id}"
  description = "Artifact Registry repository URL"
}

output "build_trigger_id" {
  value       = length(google_cloudbuild_trigger.frontend) > 0 ? google_cloudbuild_trigger.frontend[0].id : null
  description = "Cloud Build trigger ID (if created)"
}
