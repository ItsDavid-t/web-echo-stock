import { CatalogDataController } from "@/src/interfaces/controllers/catalogDataController";
import { LoadCatalogDataUseCase } from "@/src/usecases/loadCatalogDataUseCase";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";
import { SupabaseCategoryRepository } from "@/src/infra/repositories/supabaseCategoryRepository";
import { SupabaseProductRepository } from "@/src/infra/repositories/supabaseProductRepository";
import { SupabaseShopProfileRepository } from "@/src/infra/repositories/supabaseShopProfileRepository";

export function createServerContainer() {
  const productRepository = new SupabaseProductRepository();
  const categoryRepository = new SupabaseCategoryRepository();
  const shopProfileRepository = new SupabaseShopProfileRepository();

  const loadProductCatalogUseCase = new LoadProductCatalogUseCase(
    productRepository
  );

  const loadCatalogDataUseCase = new LoadCatalogDataUseCase(
    loadProductCatalogUseCase,
    categoryRepository,
    shopProfileRepository
  );

  const catalogDataController = new CatalogDataController(loadCatalogDataUseCase);

  return { catalogDataController };
}
