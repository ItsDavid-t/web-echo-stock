import type { Category } from "@/src/domain/entities/category";

export class CategoryTreeService {
  static buildIndex(categories: Category[]): Map<number, Category> {
    return new Map(categories.map((category) => [category.id, category]));
  }

  static getRootCategory(
    categoryId: number,
    categoriesById: Map<number, Category>
  ): Category | null {
    let currentCategory = categoriesById.get(categoryId);

    while (currentCategory && currentCategory.parentId != null) {
      currentCategory = categoriesById.get(currentCategory.parentId);
    }

    return currentCategory ?? null;
  }

  static getRootCategories(categories: Category[]): Category[] {
    return categories.filter((category) => category.parentId == null);
  }
}
