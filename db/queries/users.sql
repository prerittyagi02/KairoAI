-- name: CreateUser :one
INSERT INTO users (
  email,
  name,
  preferred_language
) VALUES (
  sqlc.arg(email),
  sqlc.arg(name),
  COALESCE(sqlc.narg(preferred_language), 'en')
)
RETURNING id, email, name, preferred_language, is_active, created_at, updated_at;

-- name: GetUserByID :one
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
WHERE email = $1;

-- name: ListUsers :many
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
ORDER BY created_at DESC
LIMIT sqlc.arg(limit_count)::int OFFSET sqlc.arg(offset_count)::int;

-- name: UpdateUserProfile :one
UPDATE users
SET
  name = COALESCE(sqlc.narg(name), name),
  preferred_language = COALESCE(sqlc.narg(preferred_language), preferred_language),
  is_active = COALESCE(sqlc.narg(is_active), is_active),
  updated_at = NOW()
WHERE id = sqlc.arg(id)
RETURNING id, email, name, preferred_language, is_active, created_at, updated_at;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;
