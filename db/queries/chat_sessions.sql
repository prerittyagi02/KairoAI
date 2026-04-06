-- name: CreateChatSession :one
INSERT INTO chat_sessions (
  user_id,
  title,
  context_summary
) VALUES (
  sqlc.narg(user_id),
  sqlc.narg(title),
  sqlc.narg(context_summary)
)
RETURNING id, user_id, title, context_summary, created_at, updated_at;

-- name: GetChatSessionByID :one
SELECT id, user_id, title, context_summary, created_at, updated_at
FROM chat_sessions
WHERE id = sqlc.arg(id);

-- name: ListChatSessionsByUserID :many
SELECT id, user_id, title, context_summary, created_at, updated_at
FROM chat_sessions
WHERE user_id = sqlc.narg(user_id)
ORDER BY updated_at DESC
LIMIT sqlc.arg(limit_count)::int OFFSET sqlc.arg(offset_count)::int;

-- name: UpdateChatSessionMeta :one
UPDATE chat_sessions
SET
  title = COALESCE(sqlc.narg(title), title),
  context_summary = COALESCE(sqlc.narg(context_summary), context_summary),
  updated_at = NOW()
WHERE id = sqlc.arg(id)
RETURNING id, user_id, title, context_summary, created_at, updated_at;

-- name: DeleteChatSession :exec
DELETE FROM chat_sessions
WHERE id = sqlc.arg(id);
