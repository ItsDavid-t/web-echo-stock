import type { Category } from "@/src/domain/entities/category";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";
import { supabaseFetch } from "@/src/infra/supabase/supabaseClient";

function resolveShopId(record: Record<string, unknown>): string | null {
  const value = record["shopId"] ?? record["shop_id"];
  return value == null ? null : String(value);
}

function mapSupabaseCategory(record: Record<string, unknown>): Category {
  return {
    id: Number(record["id"] ?? 0),
    name: String(record["name"] ?? ""),
    parentId:
      record["parentId"] == null ? null : Number(record["parentId"]),
    shopId: resolveShopId(record),
  };
}

const CATEGORY_QUERY_PATHS = [
  "Category?select=*&order=name",
  "Category?select=*",
];

async function fetchCategoriesFromPaths(
  paths: string[]
): Promise<Category[]> {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      const response = await supabaseFetch<Record<string, unknown>[]>(path);
      if (!Array.isArray(response)) {
        continue;
      }
      return response.map(mapSupabaseCategory);
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Error desconocido en Supabase");
    }
  }

  throw lastError ?? new Error("No se pudieron cargar las categorías");
}

export class SupabaseCategoryRepository implements CategoryRepository {
  async fetchAll(shopId?: string | null): Promise<Category[]> {
    if (!shopId) {
      return fetchCategoriesFromPaths(CATEGORY_QUERY_PATHS);
    }

    const shopPaths = [
      ...CATEGORY_QUERY_PATHS.map(
        (path) =>
          `${path}${path.includes("?") ? "&" : "?"}shopId=eq.${encodeURIComponent(shopId)}`
      ),
      ...CATEGORY_QUERY_PATHS.map(
        (path) =>
          `${path}${path.includes("?") ? "&" : "?"}shop_id=eq.${encodeURIComponent(shopId)}`
      ),
    ];

    return fetchCategoriesFromPaths(shopPaths);
  }
}
