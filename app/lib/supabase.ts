type SupabaseInsertResult<T> = { data: T | null; error: { message: string } | null };

type LeadRow = Record<string, unknown>;

type SupabaseRestClient = {
  insertLead(row: LeadRow): Promise<SupabaseInsertResult<{ id: string }>>;
};

export function getSupabase(): SupabaseRestClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const base = url.replace(/\/$/, "");
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  return {
    async insertLead(row) {
      try {
        const res = await fetch(`${base}/rest/v1/leads`, {
          method: "POST",
          headers,
          body: JSON.stringify(row),
        });
        if (!res.ok) {
          const text = await res.text();
          return { data: null, error: { message: `supabase ${res.status}: ${text}` } };
        }
        const arr = (await res.json()) as Array<{ id: string }>;
        return { data: arr[0] ?? null, error: null };
      } catch (e) {
        return { data: null, error: { message: e instanceof Error ? e.message : "unknown" } };
      }
    },
  };
}
