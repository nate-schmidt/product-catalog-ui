export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
}

export async function getServerTime(): Promise<number> {
  const data = await getJson<{ now: number }>("/api/time");
  return data.now;
}