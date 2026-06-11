const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  "https://yreqcxcolrrafdkmhsoq.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "sb_publishable_ovQyabcWMZXgZ4BHGcVYzA_2k_bxwia";

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseKey(): string {
  if (typeof window === "undefined" && SUPABASE_SERVICE_ROLE_KEY) {
    return SUPABASE_SERVICE_ROLE_KEY;
  }

  return SUPABASE_ANON_KEY;
}

export async function supabaseFetch<T = unknown>(path: string): Promise<T> {
  const key = getSupabaseKey();

  if (!SUPABASE_URL || !key) {
    throw new Error(
      "Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY."
    );
  }

  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}
