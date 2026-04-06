import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/db/sqlc";
import { createSession } from "@/db/queries/user_sessions_sql";
import { getUserByEmail } from "@/db/queries/users_sql";
import { getCredentialByUserID } from "@/db/queries/user_credentials_sql";
import {
  buildSessionCookie,
  createSessionToken,
  getSessionExpiryDate,
  hashSessionToken,
  normalizeEmail,
  verifyPassword,
} from "@/lib/auth";

type LoginBody = {
  email?: string;
  password?: string;
};

type ApiError = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string } | ApiError>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email, password } = (req.body ?? {}) as LoginBody;
  const normalizedEmail = typeof email === "string" ? normalizeEmail(email) : "";

  if (!normalizedEmail || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const user = await getUserByEmail(sql, { email: normalizedEmail });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account is inactive. Contact support." });
      return;
    }

    const credential = await getCredentialByUserID(sql, { userId: user.id });
    if (!credential) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isValid = await verifyPassword(password, credential.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const rawToken = createSessionToken();
    const tokenHash = hashSessionToken(rawToken);
    const expiresAt = getSessionExpiryDate();

    const createdSession = await createSession(sql, {
      userId: user.id,
      tokenHash,
      expiresAt,
    });
    if (!createdSession) {
      throw new Error("Failed to create session.");
    }

    res.setHeader("Set-Cookie", buildSessionCookie(rawToken, expiresAt));
    res.status(200).json({ token: rawToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    res.status(500).json({ message });
  }
}
