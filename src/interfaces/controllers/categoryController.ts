import type { Category } from "@/src/domain/entities/category";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";

export class CategoryController {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(shopId?: string | null): Promise<Category[]> {
    return this.categoryRepository.fetchAll(shopId);
  }
}
