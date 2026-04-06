import type { NextApiRequest, NextApiResponse } from "next";
import type { Sql } from "postgres";
import { sql } from "@/db/sqlc";
import { createSession } from "@/db/queries/user_sessions_sql";
import { getUserByEmail, createUser } from "@/db/queries/users_sql";
import { upsertUserCredential } from "@/db/queries/user_credentials_sql";
import {
  authConfig,
  buildSessionCookie,
  createSessionToken,
  getSessionExpiryDate,
  hashPassword,
  hashSessionToken,
  normalizeEmail,
} from "@/lib/auth";

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
  preferredLanguage?: string;
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

  const { name, email, password, preferredLanguage } = (req.body ?? {}) as SignupBody;
  const normalizedEmail = typeof email === "string" ? normalizeEmail(email) : "";
  const safeName = typeof name === "string" ? name.trim() : "";
  const lang = typeof preferredLanguage === "string" ? preferredLanguage.trim().slice(0, 8) : "en";

  if (!safeName || safeName.length < 2) {
    res.status(400).json({ message: "Name must be at least 2 characters." });
    return;
  }

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    res.status(400).json({ message: "Please provide a valid email." });
    return;
  }

  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters." });
    return;
  }

  try {
    const session = await sql.begin(async (tx) => {
      const txSql = tx as unknown as Sql;

      const existing = await getUserByEmail(txSql, { email: normalizedEmail });
      if (existing) {
        const err = new Error("Account already exists for this email.");
        (err as Error & { code?: string }).code = "DUPLICATE_EMAIL";
        throw err;
      }

      const createdUser = await createUser(txSql, {
        email: normalizedEmail,
        name: safeName,
        preferredLanguage: lang || "en",
      });

      if (!createdUser?.id) {
        throw new Error("Failed to create user.");
      }

      const passwordHash = await hashPassword(password);
      const credential = await upsertUserCredential(txSql, {
        userId: createdUser.id,
        passwordHash,
        passwordAlgo: authConfig.passwordAlgo,
      });

      if (!credential?.id) {
        throw new Error("Failed to create credentials.");
      }

      const rawToken = createSessionToken();
      const tokenHash = hashSessionToken(rawToken);
      const expiresAt = getSessionExpiryDate();

      const createdSession = await createSession(txSql, {
        userId: createdUser.id,
        tokenHash,
        expiresAt,
      });

      if (!createdSession?.id) {
        throw new Error("Failed to create session.");
      }

      return { rawToken, expiresAt };
    });

    res.setHeader("Set-Cookie", buildSessionCookie(session.rawToken, session.expiresAt));
    res.status(201).json({ token: session.rawToken });
  } catch (error) {
    const maybeError = error as { code?: string };
    if (maybeError?.code === "DUPLICATE_EMAIL" || maybeError?.code === "23505") {
      res.status(409).json({ message: "Account already exists for this email." });
      return;
    }
    const message = error instanceof Error ? error.message : "Signup failed.";
    res.status(500).json({ message });
  }
}
