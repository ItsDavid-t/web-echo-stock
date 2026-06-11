import type { Category } from "@/src/domain/entities/category";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";
import { supabaseFetch } from "@/src/lib/supabase";

const CATEGORY_SELECT = "id,name,parentId,shop_id";

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

export class SupabaseCategoryRepository implements CategoryRepository {
  async fetchAll(shopId?: string | null): Promise<Category[]> {
    const shopFilter = shopId
      ? `&shop_id=eq.${encodeURIComponent(shopId)}`
      : "";
    const response = await supabaseFetch<Record<string, unknown>[]>(
      `Category?select=${CATEGORY_SELECT}&order=name${shopFilter}`
    );

    return response.map(mapSupabaseCategory);
  }
}
