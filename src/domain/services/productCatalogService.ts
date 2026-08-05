import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { CatalogFilters, CatalogSort } from "@/src/domain/types/catalog";
import { CategoryTreeService } from "@/src/domain/services/categoryTreeService";

export class ProductCatalogService {
  static scopeProducts(products: Product[], shopId: string | null): Product[] {
    if (!shopId) {
      return products;
    }

    return products.filter((product) => product.shopId === shopId);
  }

  static scopeCategories(
    categories: Category[],
    shopId: string | null
  ): Category[] {
    if (!shopId) {
      return categories;
    }

    return categories.filter((category) => category.shopId === shopId);
  }

  static enrichProducts(
    products: Product[],
    categories: Category[],
    shopsById: Map<string, ShopProfile>
  ): Product[] {
    const categoriesById = CategoryTreeService.buildIndex(categories);

    return products.map((product) => {
      let categoryName = product.categoryName || product.category || "";

      if (!categoryName && product.categoryId != null) {
        categoryName =
          CategoryTreeService.getRootCategory(
            product.categoryId,
            categoriesById
          )?.name ?? "";
      }

      const shopName =
        product.shopId != null
          ? shopsById.get(product.shopId)?.shopName ?? null
          : null;


      return {
        ...product,
        categoryName: categoryName || "Sin categoría",
        shopName,
        price: product.price ?? undefined,
        currency: product.currency ?? "USD",
      };
    });
  }

  static extractClassifications(products: Product[]): string[] {
    return Array.from(
      new Set(
        products
          .map((product) => product.classification?.trim() ?? "")
          .filter((value) => value.length > 0)
      )
    );
  }

  static normalizeText(value: string): string {
    return value
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .trim()
      .toLowerCase();
  }

  static filterAndSort(
    products: Product[],
    categories: Category[],
    filters: CatalogFilters,
    sortBy: CatalogSort
  ): Product[] {
    const categoriesById = CategoryTreeService.buildIndex(categories);
    const normalizedSearch = ProductCatalogService.normalizeText(filters.search ?? "");

    const filtered = products.filter((product) => {
      if (filters.categoryId != null && product.categoryId != null) {
        const rootCategory = CategoryTreeService.getRootCategory(
          product.categoryId,
          categoriesById
        );
        if (rootCategory?.id !== filters.categoryId) {
          return false;
        }
      }

      if (
        filters.classification &&
        product.classification !== filters.classification
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        ProductCatalogService.normalizeText(product.name).includes(normalizedSearch) ||
        ProductCatalogService.normalizeText(String(product.description ?? "")).includes(
          normalizedSearch
        ) ||
        ProductCatalogService.normalizeText(String(product.categoryName ?? "")).includes(
          normalizedSearch
        ) ||
        ProductCatalogService.normalizeText(String(product.classification ?? "")).includes(
          normalizedSearch
        ) ||
        ProductCatalogService.normalizeText(String(product.shopName ?? "")).includes(
          normalizedSearch
        )
      );
    });

    return filtered.sort((left, right) => {
      if (sortBy === "name") {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === "shop") {
        return String(left.shopName ?? "").localeCompare(
          String(right.shopName ?? "")
        );
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }

  static countActiveFilters(
    filters: CatalogFilters,
    lockedShopId: string | null
  ): number {
    return (
      (filters.categoryId != null ? 1 : 0) +
      (filters.classification ? 1 : 0) +
      (filters.shopId && !lockedShopId ? 1 : 0)
    );
  }
}
