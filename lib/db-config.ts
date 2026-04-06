const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function shouldUseSsl(connectionString: string): boolean {
  try {
    const parsed = new URL(connectionString);
    return !LOCAL_HOSTS.has(parsed.hostname);
  } catch {
    return process.env.NODE_ENV === "production";
  }
}
