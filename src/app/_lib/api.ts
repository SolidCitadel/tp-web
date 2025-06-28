const API_HOST = "http://127.0.0.1:8081/api";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_HOST}${path}`, { cache: "no-store", ...options });
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
