import {
	createHash,
	randomBytes,
	scrypt as scryptCallback,
	timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const PASSWORD_ALGO = "scrypt-v1";
const SESSION_COOKIE_NAME = "kairo_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; 

export const authConfig = {
	passwordAlgo: PASSWORD_ALGO,
	sessionCookieName: SESSION_COOKIE_NAME,
	sessionTtlMs: SESSION_TTL_MS,
};

function encodeBase64Url(buffer: Buffer): string {
	return buffer.toString("base64url");
}

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function getSessionExpiryDate(): Date {
	return new Date(Date.now() + SESSION_TTL_MS);
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const derived = (await scrypt(password, salt, 64)) as Buffer;
	return `${PASSWORD_ALGO}$${encodeBase64Url(salt)}$${encodeBase64Url(derived)}`;
}

export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [algo, saltB64, hashB64] = stored.split("$");
	if (algo !== PASSWORD_ALGO || !saltB64 || !hashB64) {
		return false;
	}

	const salt = Buffer.from(saltB64, "base64url");
	const expected = Buffer.from(hashB64, "base64url");
	const derived = (await scrypt(password, salt, expected.length)) as Buffer;

	if (derived.length !== expected.length) {
		return false;
	}

	return timingSafeEqual(derived, expected);
}

export function createSessionToken(): string {
	return encodeBase64Url(randomBytes(32));
}

export function hashSessionToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export function buildSessionCookie(token: string, expiresAt: Date): string {
	const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
	return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; ${secure}SameSite=Lax; Expires=${expiresAt.toUTCString()}`;
}

export function clearSessionCookie(): string {
	const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
	return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; ${secure}SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getBearerToken(authorizationHeader?: string): string | null {
	if (!authorizationHeader) {
		return null;
	}
	const [scheme, token] = authorizationHeader.split(" ");
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return null;
	}
	return token;
}
