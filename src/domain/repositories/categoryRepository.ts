import type { Category } from "@/src/domain/entities/category";

export interface CategoryRepository {
  fetchAll(shopId?: string | null): Promise<Category[]>;
}
