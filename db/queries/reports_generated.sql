-- name: CreateGeneratedReport :one
INSERT INTO reports_generated (
  user_id,
  source_type,
  input_file_name,
  input_mime_type,
  input_size_bytes,
  language_code,
  model_name,
  analysis_markdown,
  status,
  error_message
) VALUES (
  sqlc.narg(user_id),
  sqlc.arg(source_type),
  sqlc.narg(input_file_name),
  sqlc.narg(input_mime_type),
  sqlc.narg(input_size_bytes),
  COALESCE(sqlc.narg(language_code), 'en'),
  sqlc.narg(model_name),
  sqlc.narg(analysis_markdown),
  COALESCE(sqlc.narg(status), 'completed'),
  sqlc.narg(error_message)
)
RETURNING id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at;

-- name: GetGeneratedReportByID :one
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE id = $1;

-- name: ListGeneratedReportsByUserID :many
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT sqlc.arg(limit_count)::int OFFSET sqlc.arg(offset_count)::int;

-- name: ListGeneratedReportsByType :many
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE source_type = $1
ORDER BY created_at DESC
LIMIT sqlc.arg(limit_count)::int OFFSET sqlc.arg(offset_count)::int;

-- name: UpdateGeneratedReportStatus :one
UPDATE reports_generated
SET
  status = $2,
  error_message = $3,
  updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at;

-- name: DeleteGeneratedReport :exec
DELETE FROM reports_generated
WHERE id = $1;
