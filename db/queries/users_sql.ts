import { Sql } from "postgres";

export const createUserQuery = `-- name: CreateUser :one
INSERT INTO users (
  email,
  name,
  preferred_language
) VALUES (
  $1,
  $2,
  COALESCE($3, 'en')
)
RETURNING id, email, name, preferred_language, is_active, created_at, updated_at`;

export interface CreateUserArgs {
    email: string;
    name: string;
    preferredLanguage: string | null;
}

export interface CreateUserRow {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function createUser(sql: Sql, args: CreateUserArgs): Promise<CreateUserRow | null> {
    const rows = await sql.unsafe(createUserQuery, [args.email, args.name, args.preferredLanguage]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        email: row[1],
        name: row[2],
        preferredLanguage: row[3],
        isActive: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const getUserByIDQuery = `-- name: GetUserByID :one
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
WHERE id = $1`;

export interface GetUserByIDArgs {
    id: string;
}

export interface GetUserByIDRow {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserByID(sql: Sql, args: GetUserByIDArgs): Promise<GetUserByIDRow | null> {
    const rows = await sql.unsafe(getUserByIDQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        email: row[1],
        name: row[2],
        preferredLanguage: row[3],
        isActive: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const getUserByEmailQuery = `-- name: GetUserByEmail :one
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
WHERE email = $1`;

export interface GetUserByEmailArgs {
    email: string;
}

export interface GetUserByEmailRow {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserByEmail(sql: Sql, args: GetUserByEmailArgs): Promise<GetUserByEmailRow | null> {
    const rows = await sql.unsafe(getUserByEmailQuery, [args.email]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        email: row[1],
        name: row[2],
        preferredLanguage: row[3],
        isActive: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const listUsersQuery = `-- name: ListUsers :many
SELECT id, email, name, preferred_language, is_active, created_at, updated_at
FROM users
ORDER BY created_at DESC
LIMIT $2::int OFFSET $1::int`;

export interface ListUsersArgs {
    offsetCount: number;
    limitCount: number;
}

export interface ListUsersRow {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function listUsers(sql: Sql, args: ListUsersArgs): Promise<ListUsersRow[]> {
    return (await sql.unsafe(listUsersQuery, [args.offsetCount, args.limitCount]).values()).map(row => ({
        id: row[0],
        email: row[1],
        name: row[2],
        preferredLanguage: row[3],
        isActive: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    }));
}

export const updateUserProfileQuery = `-- name: UpdateUserProfile :one
UPDATE users
SET
  name = COALESCE($1, name),
  preferred_language = COALESCE($2, preferred_language),
  is_active = COALESCE($3, is_active),
  updated_at = NOW()
WHERE id = $4
RETURNING id, email, name, preferred_language, is_active, created_at, updated_at`;

export interface UpdateUserProfileArgs {
    name: string | null;
    preferredLanguage: string | null;
    isActive: boolean | null;
    id: string;
}

export interface UpdateUserProfileRow {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function updateUserProfile(sql: Sql, args: UpdateUserProfileArgs): Promise<UpdateUserProfileRow | null> {
    const rows = await sql.unsafe(updateUserProfileQuery, [args.name, args.preferredLanguage, args.isActive, args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        email: row[1],
        name: row[2],
        preferredLanguage: row[3],
        isActive: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const deleteUserQuery = `-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1`;

export interface DeleteUserArgs {
    id: string;
}

export async function deleteUser(sql: Sql, args: DeleteUserArgs): Promise<void> {
    await sql.unsafe(deleteUserQuery, [args.id]);
}

