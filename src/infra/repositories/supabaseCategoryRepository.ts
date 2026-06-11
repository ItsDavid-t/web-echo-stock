import type { Category } from "@/src/domain/entities/category";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";
import { supabaseFetch } from "@/src/lib/supabase";

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

async function fetchCategories(path: string): Promise<Category[]> {
  const response = await supabaseFetch<Record<string, unknown>[]>(path);
  return response.map(mapSupabaseCategory);
}

export class SupabaseCategoryRepository implements CategoryRepository {
  async fetchAll(shopId?: string | null): Promise<Category[]> {
    const basePath = "Category?select=*&order=name";

    if (!shopId) {
      return fetchCategories(basePath);
    }

    try {
      return await fetchCategories(
        `${basePath}&shopId=eq.${encodeURIComponent(shopId)}`
      );
    } catch {
      return fetchCategories(
        `${basePath}&shop_id=eq.${encodeURIComponent(shopId)}`
      );
    }
  }
}
