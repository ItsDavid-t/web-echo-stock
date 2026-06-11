import type { Product } from "@/src/domain/entities/product";
import type { RecentProductsRepository } from "@/src/domain/repositories/recentProductsRepository";

export class ManageRecentProductsUseCase {
  constructor(private readonly repository: RecentProductsRepository) {}

  track(productId: string): void {
    this.repository.trackProduct(productId);
  }

  getRecentIds(): string[] {
    return this.repository.getRecentIds();
  }

  getRecentProducts(products: Product[]): Product[] {
    const productsById = new Map(products.map((product) => [product.id, product]));

    return this.repository
      .getRecentIds()
      .map((id) => productsById.get(id))
      .filter((product): product is Product => product != null);
  }
}
