-- name: UpsertUserCredential :one
INSERT INTO user_credentials (
  user_id,
  password_hash,
  password_algo
) VALUES (
  sqlc.arg(user_id),
  sqlc.arg(password_hash),
  COALESCE(sqlc.narg(password_algo), 'bcrypt')
)
ON CONFLICT (user_id)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  password_algo = EXCLUDED.password_algo,
  last_password_change_at = NOW(),
  updated_at = NOW()
RETURNING id, user_id, password_hash, password_algo, last_password_change_at, created_at, updated_at;

-- name: GetCredentialByUserID :one
SELECT id, user_id, password_hash, password_algo, last_password_change_at, created_at, updated_at
FROM user_credentials
WHERE user_id = $1;

-- name: DeleteCredentialByUserID :exec
DELETE FROM user_credentials
WHERE user_id = $1;
