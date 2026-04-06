-- name: CreateSession :one
INSERT INTO user_sessions (
  user_id,
  token_hash,
  expires_at
) VALUES (
  sqlc.arg(user_id),
  sqlc.arg(token_hash),
  sqlc.arg(expires_at)
)
RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at;

-- name: GetSessionByTokenHash :one
SELECT id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at
FROM user_sessions
WHERE token_hash = sqlc.arg(token_hash);

-- name: ListActiveSessionsByUserID :many
SELECT id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at
FROM user_sessions
WHERE user_id = sqlc.arg(user_id)
  AND revoked_at IS NULL
  AND expires_at > NOW()
ORDER BY created_at DESC;

-- name: RevokeSessionByTokenHash :one
UPDATE user_sessions
SET revoked_at = NOW(), updated_at = NOW()
WHERE token_hash = sqlc.arg(token_hash)
RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at;

-- name: RevokeAllSessionsByUserID :exec
UPDATE user_sessions
SET revoked_at = NOW(), updated_at = NOW()
WHERE user_id = sqlc.arg(user_id)
  AND revoked_at IS NULL;

-- name: DeleteExpiredSessions :exec
DELETE FROM user_sessions
WHERE expires_at < NOW();
