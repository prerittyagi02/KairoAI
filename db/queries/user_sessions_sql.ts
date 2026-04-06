import { Sql } from "postgres";

export const createSessionQuery = `-- name: CreateSession :one
INSERT INTO user_sessions (
  user_id,
  token_hash,
  expires_at
) VALUES (
  $1,
  $2,
  $3
)
RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at`;

export interface CreateSessionArgs {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}

export interface CreateSessionRow {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function createSession(sql: Sql, args: CreateSessionArgs): Promise<CreateSessionRow | null> {
    const rows = await sql.unsafe(createSessionQuery, [args.userId, args.tokenHash, args.expiresAt]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        tokenHash: row[2],
        expiresAt: row[3],
        revokedAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const getSessionByTokenHashQuery = `-- name: GetSessionByTokenHash :one
SELECT id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at
FROM user_sessions
WHERE token_hash = $1`;

export interface GetSessionByTokenHashArgs {
    tokenHash: string;
}

export interface GetSessionByTokenHashRow {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getSessionByTokenHash(sql: Sql, args: GetSessionByTokenHashArgs): Promise<GetSessionByTokenHashRow | null> {
    const rows = await sql.unsafe(getSessionByTokenHashQuery, [args.tokenHash]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        tokenHash: row[2],
        expiresAt: row[3],
        revokedAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const listActiveSessionsByUserIDQuery = `-- name: ListActiveSessionsByUserID :many
SELECT id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at
FROM user_sessions
WHERE user_id = $1
  AND revoked_at IS NULL
  AND expires_at > NOW()
ORDER BY created_at DESC`;

export interface ListActiveSessionsByUserIDArgs {
    userId: string;
}

export interface ListActiveSessionsByUserIDRow {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function listActiveSessionsByUserID(sql: Sql, args: ListActiveSessionsByUserIDArgs): Promise<ListActiveSessionsByUserIDRow[]> {
    return (await sql.unsafe(listActiveSessionsByUserIDQuery, [args.userId]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        tokenHash: row[2],
        expiresAt: row[3],
        revokedAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    }));
}

export const revokeSessionByTokenHashQuery = `-- name: RevokeSessionByTokenHash :one
UPDATE user_sessions
SET revoked_at = NOW(), updated_at = NOW()
WHERE token_hash = $1
RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at, updated_at`;

export interface RevokeSessionByTokenHashArgs {
    tokenHash: string;
}

export interface RevokeSessionByTokenHashRow {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function revokeSessionByTokenHash(sql: Sql, args: RevokeSessionByTokenHashArgs): Promise<RevokeSessionByTokenHashRow | null> {
    const rows = await sql.unsafe(revokeSessionByTokenHashQuery, [args.tokenHash]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        tokenHash: row[2],
        expiresAt: row[3],
        revokedAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const revokeAllSessionsByUserIDQuery = `-- name: RevokeAllSessionsByUserID :exec
UPDATE user_sessions
SET revoked_at = NOW(), updated_at = NOW()
WHERE user_id = $1
  AND revoked_at IS NULL`;

export interface RevokeAllSessionsByUserIDArgs {
    userId: string;
}

export async function revokeAllSessionsByUserID(sql: Sql, args: RevokeAllSessionsByUserIDArgs): Promise<void> {
    await sql.unsafe(revokeAllSessionsByUserIDQuery, [args.userId]);
}

export const deleteExpiredSessionsQuery = `-- name: DeleteExpiredSessions :exec
DELETE FROM user_sessions
WHERE expires_at < NOW()`;

export async function deleteExpiredSessions(sql: Sql): Promise<void> {
    await sql.unsafe(deleteExpiredSessionsQuery, []);
}

