import { writeFileSync } from "node:fs";

const url =
  process.env.SUPABASE_URL ?? "https://yreqcxcolrrafdkmhsoq.supabase.co";
const anonKey =
  process.env.SUPABASE_ANON_KEY ??
  "sb_publishable_ovQyabcWMZXgZ4BHGcVYzA_2k_bxwia";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function probe(label, key, path) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  const text = await response.text();
  return { label, status: response.status, body: text };
}

const results = [];

for (const path of [
  "Product?select=id,name,status&limit=5",
  "Category?select=id,name&limit=5",
]) {
  results.push(await probe(`anon:${path}`, anonKey, path));
  if (serviceKey) {
    results.push(await probe(`service:${path}`, serviceKey, path));
  }
}

const output = JSON.stringify(results, null, 2);
writeFileSync("supabase-check.json", output);
console.log(output);
