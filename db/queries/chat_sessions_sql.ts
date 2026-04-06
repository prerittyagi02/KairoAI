import { Sql } from "postgres";

export const createChatSessionQuery = `-- name: CreateChatSession :one
INSERT INTO chat_sessions (
  user_id,
  title,
  context_summary
) VALUES (
  $1,
  $2,
  $3
)
RETURNING id, user_id, title, context_summary, created_at, updated_at`;

export interface CreateChatSessionArgs {
    userId: string | null;
    title: string | null;
    contextSummary: string | null;
}

export interface CreateChatSessionRow {
    id: string;
    userId: string | null;
    title: string | null;
    contextSummary: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function createChatSession(sql: Sql, args: CreateChatSessionArgs): Promise<CreateChatSessionRow | null> {
    const rows = await sql.unsafe(createChatSessionQuery, [args.userId, args.title, args.contextSummary]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        title: row[2],
        contextSummary: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    };
}

export const getChatSessionByIDQuery = `-- name: GetChatSessionByID :one
SELECT id, user_id, title, context_summary, created_at, updated_at
FROM chat_sessions
WHERE id = $1`;

export interface GetChatSessionByIDArgs {
    id: string;
}

export interface GetChatSessionByIDRow {
    id: string;
    userId: string | null;
    title: string | null;
    contextSummary: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getChatSessionByID(sql: Sql, args: GetChatSessionByIDArgs): Promise<GetChatSessionByIDRow | null> {
    const rows = await sql.unsafe(getChatSessionByIDQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        title: row[2],
        contextSummary: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    };
}

export const listChatSessionsByUserIDQuery = `-- name: ListChatSessionsByUserID :many
SELECT id, user_id, title, context_summary, created_at, updated_at
FROM chat_sessions
WHERE user_id = $1
ORDER BY updated_at DESC
LIMIT $3::int OFFSET $2::int`;

export interface ListChatSessionsByUserIDArgs {
    userId: string | null;
    offsetCount: number;
    limitCount: number;
}

export interface ListChatSessionsByUserIDRow {
    id: string;
    userId: string | null;
    title: string | null;
    contextSummary: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function listChatSessionsByUserID(sql: Sql, args: ListChatSessionsByUserIDArgs): Promise<ListChatSessionsByUserIDRow[]> {
    return (await sql.unsafe(listChatSessionsByUserIDQuery, [args.userId, args.offsetCount, args.limitCount]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        title: row[2],
        contextSummary: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    }));
}

export const updateChatSessionMetaQuery = `-- name: UpdateChatSessionMeta :one
UPDATE chat_sessions
SET
  title = COALESCE($1, title),
  context_summary = COALESCE($2, context_summary),
  updated_at = NOW()
WHERE id = $3
RETURNING id, user_id, title, context_summary, created_at, updated_at`;

export interface UpdateChatSessionMetaArgs {
    title: string | null;
    contextSummary: string | null;
    id: string;
}

export interface UpdateChatSessionMetaRow {
    id: string;
    userId: string | null;
    title: string | null;
    contextSummary: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function updateChatSessionMeta(sql: Sql, args: UpdateChatSessionMetaArgs): Promise<UpdateChatSessionMetaRow | null> {
    const rows = await sql.unsafe(updateChatSessionMetaQuery, [args.title, args.contextSummary, args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        title: row[2],
        contextSummary: row[3],
        createdAt: row[4],
        updatedAt: row[5]
    };
}

export const deleteChatSessionQuery = `-- name: DeleteChatSession :exec
DELETE FROM chat_sessions
WHERE id = $1`;

export interface DeleteChatSessionArgs {
    id: string;
}

export async function deleteChatSession(sql: Sql, args: DeleteChatSessionArgs): Promise<void> {
    await sql.unsafe(deleteChatSessionQuery, [args.id]);
}

