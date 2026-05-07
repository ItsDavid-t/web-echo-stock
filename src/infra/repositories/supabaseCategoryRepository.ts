import type { Category } from "@/src/domain/entities/category";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";
import { supabaseFetch } from "@/src/lib/supabase";

function mapSupabaseCategory(record: Record<string, unknown>): Category {
  return {
    id: Number(record["id"] ?? 0),
    name: String(record["name"] ?? ""),
    parentId:
      record["parentId"] == null ? null : Number(record["parentId"]),
  };
}

export class SupabaseCategoryRepository implements CategoryRepository {
  async fetchAll(): Promise<Category[]> {
    const response = await supabaseFetch<Record<string, unknown>[]>(
      "Category?select=id,name,parentId&order=name"
    );

    return response.map(mapSupabaseCategory);
  }
}
