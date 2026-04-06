import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/db/sqlc";
import { getSessionByTokenHash } from "@/db/queries/user_sessions_sql";
import { getUserByID } from "@/db/queries/users_sql";
import { authConfig, getBearerToken, hashSessionToken } from "@/lib/auth";

type ApiError = { message: string };

type MeResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
  };
};

function readSessionToken(req: NextApiRequest): string | null {
  const bearer = getBearerToken(req.headers.authorization);
  if (bearer) {
    return bearer;
  }
  return req.cookies?.[authConfig.sessionCookieName] ?? null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse | ApiError>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const token = readSessionToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const tokenHash = hashSessionToken(token);
    const session = await getSessionByTokenHash(sql, { tokenHash });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      res.status(401).json({ message: "Session expired or invalid." });
      return;
    }

    const user = await getUserByID(sql, { id: session.userId });
    if (!user) {
      res.status(401).json({ message: "Session expired or invalid." });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferredLanguage: user.preferredLanguage,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch user.";
    res.status(500).json({ message });
  }
}
