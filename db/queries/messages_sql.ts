import { Sql } from "postgres";

export const createMessageQuery = `-- name: CreateMessage :one
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
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
)
RETURNING id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at`;

export interface CreateMessageArgs {
    chatSessionId: string;
    userId: string | null;
    role: string;
    content: string;
    languageCode: string | null;
    modelName: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
}

export interface CreateMessageRow {
    id: string;
    chatSessionId: string;
    userId: string | null;
    role: string;
    content: string;
    languageCode: string | null;
    modelName: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
    createdAt: Date;
}

export async function createMessage(sql: Sql, args: CreateMessageArgs): Promise<CreateMessageRow | null> {
    const rows = await sql.unsafe(createMessageQuery, [args.chatSessionId, args.userId, args.role, args.content, args.languageCode, args.modelName, args.promptTokens, args.completionTokens]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        chatSessionId: row[1],
        userId: row[2],
        role: row[3],
        content: row[4],
        languageCode: row[5],
        modelName: row[6],
        promptTokens: row[7],
        completionTokens: row[8],
        createdAt: row[9]
    };
}

export const listMessagesByChatSessionQuery = `-- name: ListMessagesByChatSession :many
SELECT id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at
FROM messages
WHERE chat_session_id = $1
ORDER BY created_at ASC`;

export interface ListMessagesByChatSessionArgs {
    chatSessionId: string;
}

export interface ListMessagesByChatSessionRow {
    id: string;
    chatSessionId: string;
    userId: string | null;
    role: string;
    content: string;
    languageCode: string | null;
    modelName: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
    createdAt: Date;
}

export async function listMessagesByChatSession(sql: Sql, args: ListMessagesByChatSessionArgs): Promise<ListMessagesByChatSessionRow[]> {
    return (await sql.unsafe(listMessagesByChatSessionQuery, [args.chatSessionId]).values()).map(row => ({
        id: row[0],
        chatSessionId: row[1],
        userId: row[2],
        role: row[3],
        content: row[4],
        languageCode: row[5],
        modelName: row[6],
        promptTokens: row[7],
        completionTokens: row[8],
        createdAt: row[9]
    }));
}

export const listRecentMessagesByChatSessionQuery = `-- name: ListRecentMessagesByChatSession :many
SELECT id, chat_session_id, user_id, role, content, language_code, model_name, prompt_tokens, completion_tokens, created_at
FROM messages
WHERE chat_session_id = $1
ORDER BY created_at DESC
LIMIT $2::int`;

export interface ListRecentMessagesByChatSessionArgs {
    chatSessionId: string;
    limitCount: number;
}

export interface ListRecentMessagesByChatSessionRow {
    id: string;
    chatSessionId: string;
    userId: string | null;
    role: string;
    content: string;
    languageCode: string | null;
    modelName: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
    createdAt: Date;
}

export async function listRecentMessagesByChatSession(sql: Sql, args: ListRecentMessagesByChatSessionArgs): Promise<ListRecentMessagesByChatSessionRow[]> {
    return (await sql.unsafe(listRecentMessagesByChatSessionQuery, [args.chatSessionId, args.limitCount]).values()).map(row => ({
        id: row[0],
        chatSessionId: row[1],
        userId: row[2],
        role: row[3],
        content: row[4],
        languageCode: row[5],
        modelName: row[6],
        promptTokens: row[7],
        completionTokens: row[8],
        createdAt: row[9]
    }));
}

export const deleteMessagesByChatSessionQuery = `-- name: DeleteMessagesByChatSession :exec
DELETE FROM messages
WHERE chat_session_id = $1`;

export interface DeleteMessagesByChatSessionArgs {
    chatSessionId: string;
}

export async function deleteMessagesByChatSession(sql: Sql, args: DeleteMessagesByChatSessionArgs): Promise<void> {
    await sql.unsafe(deleteMessagesByChatSessionQuery, [args.chatSessionId]);
}

