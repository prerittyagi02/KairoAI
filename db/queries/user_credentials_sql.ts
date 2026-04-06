import { Sql } from "postgres";

export const upsertUserCredentialQuery = `-- name: UpsertUserCredential :one
INSERT INTO user_credentials (
  user_id,
  password_hash,
  password_algo
) VALUES (
  $1,
  $2,
  COALESCE($3, 'bcrypt')
)
ON CONFLICT (user_id)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  password_algo = EXCLUDED.password_algo,
  last_password_change_at = NOW(),
  updated_at = NOW()
RETURNING id, user_id, password_hash, password_algo, last_password_change_at, created_at, updated_at`;

export interface UpsertUserCredentialArgs {
    userId: string;
    passwordHash: string;
    passwordAlgo: string | null;
}

export interface UpsertUserCredentialRow {
    id: string;
    userId: string;
    passwordHash: string;
    passwordAlgo: string;
    lastPasswordChangeAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export async function upsertUserCredential(sql: Sql, args: UpsertUserCredentialArgs): Promise<UpsertUserCredentialRow | null> {
    const rows = await sql.unsafe(upsertUserCredentialQuery, [args.userId, args.passwordHash, args.passwordAlgo]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        passwordHash: row[2],
        passwordAlgo: row[3],
        lastPasswordChangeAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const getCredentialByUserIDQuery = `-- name: GetCredentialByUserID :one
SELECT id, user_id, password_hash, password_algo, last_password_change_at, created_at, updated_at
FROM user_credentials
WHERE user_id = $1`;

export interface GetCredentialByUserIDArgs {
    userId: string;
}

export interface GetCredentialByUserIDRow {
    id: string;
    userId: string;
    passwordHash: string;
    passwordAlgo: string;
    lastPasswordChangeAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export async function getCredentialByUserID(sql: Sql, args: GetCredentialByUserIDArgs): Promise<GetCredentialByUserIDRow | null> {
    const rows = await sql.unsafe(getCredentialByUserIDQuery, [args.userId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        passwordHash: row[2],
        passwordAlgo: row[3],
        lastPasswordChangeAt: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const deleteCredentialByUserIDQuery = `-- name: DeleteCredentialByUserID :exec
DELETE FROM user_credentials
WHERE user_id = $1`;

export interface DeleteCredentialByUserIDArgs {
    userId: string;
}

export async function deleteCredentialByUserID(sql: Sql, args: DeleteCredentialByUserIDArgs): Promise<void> {
    await sql.unsafe(deleteCredentialByUserIDQuery, [args.userId]);
}

