export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const headers = new Headers(options?.headers ?? {});
    if (!headers.has("Content-Type") && options?.body) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(path, {
      credentials: "include",
      headers,
      ...options,
    });

    const json = (await res.json()) as any;
    if (!res.ok) {
      return {
        success: false,
        error: json?.message || "An error occurred",
      };
    }

    return {
      success: true,
      data: json,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error)?.message || "Network error",
    };
  }
}
