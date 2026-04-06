import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/db/sqlc";
import { getSessionByTokenHash, revokeSessionByTokenHash } from "@/db/queries/user_sessions_sql";
import { authConfig, clearSessionCookie, getBearerToken, hashSessionToken } from "@/lib/auth";

type ApiError = { message: string };
type LogoutResponse = { success: true };

function readSessionToken(req: NextApiRequest): string | null {
  const bearer = getBearerToken(req.headers.authorization);
  if (bearer) {
    return bearer;
  }
  return req.cookies?.[authConfig.sessionCookieName] ?? null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse | ApiError>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const token = readSessionToken(req);

  try {
    if (token) {
      const tokenHash = hashSessionToken(token);
      const existingSession = await getSessionByTokenHash(sql, { tokenHash });
      if (existingSession && !existingSession.revokedAt) {
        await revokeSessionByTokenHash(sql, { tokenHash });
      }
    }

    res.setHeader("Set-Cookie", clearSessionCookie());
    res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed.";
    res.status(500).json({ message });
  }
}
