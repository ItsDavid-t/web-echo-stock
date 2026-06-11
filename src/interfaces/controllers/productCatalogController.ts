import type { Product } from "@/src/domain/entities/product";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";

export class ProductCatalogController {
  constructor(private readonly loadProductCatalogUseCase: LoadProductCatalogUseCase) {}

  async getCatalog(shopId?: string | null): Promise<Product[]> {
    return this.loadProductCatalogUseCase.execute(shopId);
  }
}
