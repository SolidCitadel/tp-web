const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_HOST}${path}`, { cache: "no-store", ...options });
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
