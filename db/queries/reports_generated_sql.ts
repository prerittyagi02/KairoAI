import { Sql } from "postgres";

export const createGeneratedReportQuery = `-- name: CreateGeneratedReport :one
INSERT INTO reports_generated (
  user_id,
  source_type,
  input_file_name,
  input_mime_type,
  input_size_bytes,
  language_code,
  model_name,
  analysis_markdown,
  status,
  error_message
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  COALESCE($6, 'en'),
  $7,
  $8,
  COALESCE($9, 'completed'),
  $10
)
RETURNING id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at`;

export interface CreateGeneratedReportArgs {
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string | null;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string | null;
    errorMessage: string | null;
}

export interface CreateGeneratedReportRow {
    id: string;
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function createGeneratedReport(sql: Sql, args: CreateGeneratedReportArgs): Promise<CreateGeneratedReportRow | null> {
    const rows = await sql.unsafe(createGeneratedReportQuery, [args.userId, args.sourceType, args.inputFileName, args.inputMimeType, args.inputSizeBytes, args.languageCode, args.modelName, args.analysisMarkdown, args.status, args.errorMessage]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        sourceType: row[2],
        inputFileName: row[3],
        inputMimeType: row[4],
        inputSizeBytes: row[5],
        languageCode: row[6],
        modelName: row[7],
        analysisMarkdown: row[8],
        status: row[9],
        errorMessage: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    };
}

export const getGeneratedReportByIDQuery = `-- name: GetGeneratedReportByID :one
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE id = $1`;

export interface GetGeneratedReportByIDArgs {
    id: string;
}

export interface GetGeneratedReportByIDRow {
    id: string;
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getGeneratedReportByID(sql: Sql, args: GetGeneratedReportByIDArgs): Promise<GetGeneratedReportByIDRow | null> {
    const rows = await sql.unsafe(getGeneratedReportByIDQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        sourceType: row[2],
        inputFileName: row[3],
        inputMimeType: row[4],
        inputSizeBytes: row[5],
        languageCode: row[6],
        modelName: row[7],
        analysisMarkdown: row[8],
        status: row[9],
        errorMessage: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    };
}

export const listGeneratedReportsByUserIDQuery = `-- name: ListGeneratedReportsByUserID :many
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $3::int OFFSET $2::int`;

export interface ListGeneratedReportsByUserIDArgs {
    userId: string | null;
    offsetCount: number;
    limitCount: number;
}

export interface ListGeneratedReportsByUserIDRow {
    id: string;
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function listGeneratedReportsByUserID(sql: Sql, args: ListGeneratedReportsByUserIDArgs): Promise<ListGeneratedReportsByUserIDRow[]> {
    return (await sql.unsafe(listGeneratedReportsByUserIDQuery, [args.userId, args.offsetCount, args.limitCount]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        sourceType: row[2],
        inputFileName: row[3],
        inputMimeType: row[4],
        inputSizeBytes: row[5],
        languageCode: row[6],
        modelName: row[7],
        analysisMarkdown: row[8],
        status: row[9],
        errorMessage: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    }));
}

export const listGeneratedReportsByTypeQuery = `-- name: ListGeneratedReportsByType :many
SELECT id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at
FROM reports_generated
WHERE source_type = $1
ORDER BY created_at DESC
LIMIT $3::int OFFSET $2::int`;

export interface ListGeneratedReportsByTypeArgs {
    sourceType: string;
    offsetCount: number;
    limitCount: number;
}

export interface ListGeneratedReportsByTypeRow {
    id: string;
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function listGeneratedReportsByType(sql: Sql, args: ListGeneratedReportsByTypeArgs): Promise<ListGeneratedReportsByTypeRow[]> {
    return (await sql.unsafe(listGeneratedReportsByTypeQuery, [args.sourceType, args.offsetCount, args.limitCount]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        sourceType: row[2],
        inputFileName: row[3],
        inputMimeType: row[4],
        inputSizeBytes: row[5],
        languageCode: row[6],
        modelName: row[7],
        analysisMarkdown: row[8],
        status: row[9],
        errorMessage: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    }));
}

export const updateGeneratedReportStatusQuery = `-- name: UpdateGeneratedReportStatus :one
UPDATE reports_generated
SET
  status = $2,
  error_message = $3,
  updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, source_type, input_file_name, input_mime_type, input_size_bytes, language_code, model_name, analysis_markdown, status, error_message, created_at, updated_at`;

export interface UpdateGeneratedReportStatusArgs {
    id: string;
    status: string;
    errorMessage: string | null;
}

export interface UpdateGeneratedReportStatusRow {
    id: string;
    userId: string | null;
    sourceType: string;
    inputFileName: string | null;
    inputMimeType: string | null;
    inputSizeBytes: string | null;
    languageCode: string;
    modelName: string | null;
    analysisMarkdown: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function updateGeneratedReportStatus(sql: Sql, args: UpdateGeneratedReportStatusArgs): Promise<UpdateGeneratedReportStatusRow | null> {
    const rows = await sql.unsafe(updateGeneratedReportStatusQuery, [args.id, args.status, args.errorMessage]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        sourceType: row[2],
        inputFileName: row[3],
        inputMimeType: row[4],
        inputSizeBytes: row[5],
        languageCode: row[6],
        modelName: row[7],
        analysisMarkdown: row[8],
        status: row[9],
        errorMessage: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    };
}

export const deleteGeneratedReportQuery = `-- name: DeleteGeneratedReport :exec
DELETE FROM reports_generated
WHERE id = $1`;

export interface DeleteGeneratedReportArgs {
    id: string;
}

export async function deleteGeneratedReport(sql: Sql, args: DeleteGeneratedReportArgs): Promise<void> {
    await sql.unsafe(deleteGeneratedReportQuery, [args.id]);
}

