import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { CategoryRepository } from "@/src/domain/repositories/categoryRepository";
import type { ShopProfileRepository } from "@/src/domain/repositories/shopProfileRepository";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";

export type CatalogData = {
  products: Product[];
  categories: Category[];
  shops: ShopProfile[];
};

export class LoadCatalogDataUseCase {
  constructor(
    private readonly loadProductCatalogUseCase: LoadProductCatalogUseCase,
    private readonly categoryRepository: CategoryRepository,
    private readonly shopProfileRepository: ShopProfileRepository
  ) {}

  async execute(lockedShopId?: string | null): Promise<CatalogData> {
    const [products, categories, shops] = await Promise.all([
      this.loadProductCatalogUseCase.execute(lockedShopId ?? null),
      this.categoryRepository.fetchAll(lockedShopId ?? null),
      this.shopProfileRepository.fetchAll(),
    ]);

    return { products, categories, shops };
  }
}
