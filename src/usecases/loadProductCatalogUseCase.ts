import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";

export class LoadProductCatalogUseCase {
    
  constructor(private readonly repository: ProductRepository) {}
;



  async execute(): Promise<Product[]> {

    const products = await this.repository.fetchAll();
    const availableProducts = products
      .filter((product) => product.status === "available")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return availableProducts;
  }
}
