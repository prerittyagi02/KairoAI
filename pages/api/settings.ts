import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/db/sqlc";
import { getSessionByTokenHash } from "@/db/queries/user_sessions_sql";
import { updateUserProfile } from "@/db/queries/users_sql";
import { authConfig, getBearerToken, hashSessionToken } from "@/lib/auth";

type ApiError = { message: string };

type SettingsResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    preferredLanguage: string;
    isActive: boolean;
  };
};

type SettingsBody = {
  displayName?: string;
  preferredLanguage?: string;
};

const supportedLanguages = new Set([
  "en",
  "hi",
  "ta",
  "te",
  "bn",
  "mr",
  "gu",
  "pa",
  "ml",
  "kn",
]);

function readSessionToken(req: NextApiRequest): string | null {
  const bearer = getBearerToken(req.headers.authorization);
  if (bearer) {
    return bearer;
  }
  return req.cookies?.[authConfig.sessionCookieName] ?? null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse | ApiError>
) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const token = readSessionToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { displayName, preferredLanguage } = (req.body ?? {}) as SettingsBody;
  const nextName =
    typeof displayName === "string" ? displayName.trim().slice(0, 120) : "";
  const nextLang =
    typeof preferredLanguage === "string" ? preferredLanguage.trim().slice(0, 8) : "";

  if (!nextName) {
    res.status(400).json({ message: "Display name is required." });
    return;
  }

  if (!nextLang) {
    res.status(400).json({ message: "Preferred language is required." });
    return;
  }

  if (!supportedLanguages.has(nextLang)) {
    res.status(400).json({ message: "Unsupported preferred language." });
    return;
  }

  try {
    const tokenHash = hashSessionToken(token);
    const session = await getSessionByTokenHash(sql, { tokenHash });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      res.status(401).json({ message: "Session expired or invalid." });
      return;
    }

    const updatedUser = await updateUserProfile(sql, {
      id: session.userId,
      name: nextName,
      preferredLanguage: nextLang,
      isActive: null,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        preferredLanguage: updatedUser.preferredLanguage,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update settings.";
    res.status(500).json({ message });
  }
}
