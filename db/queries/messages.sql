-- name: CreateMessage :one
INSERT INTO messages (
  chat_session_id,
  user_id,
  role,
  content,
  language_code,
  model_name,
  prompt_tokens,
  completion_tokens
) VALUES (
  sqlc.arg(chat_session_id),
  sqlc.narg(user_id),
  sqlc.arg(role),
  sqlc.arg(content),
  sqlc.narg(language_code),
  sqlc.narg(model_name),
  sqlc.narg(prompt_tokens),
  sqlc.narg(completion_tokens)
)
RETURNING id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at;

-- name: ListMessagesByChatSession :many
SELECT id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at
FROM messages
WHERE chat_session_id = sqlc.arg(chat_session_id)
ORDER BY created_at ASC;

-- name: ListRecentMessagesByChatSession :many
SELECT id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at
FROM messages
WHERE chat_session_id = sqlc.arg(chat_session_id)
ORDER BY created_at DESC
LIMIT sqlc.arg(limit_count)::int;

-- name: DeleteMessagesByChatSession :exec
DELETE FROM messages
WHERE chat_session_id = sqlc.arg(chat_session_id);
