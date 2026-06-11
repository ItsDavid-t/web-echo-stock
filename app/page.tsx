import { ProductCatalogPage } from "@/src/ui/pages/ProductCatalogPage";
import { ProductCatalogController } from "@/src/interfaces/controllers/productCatalogController";
import { CategoryController } from "@/src/interfaces/controllers/categoryController";
import { ShopProfileController } from "@/src/interfaces/controllers/shopProfileController";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";
import { LoadShopProfilesUseCase } from "@/src/usecases/loadShopProfilesUseCase";
import { SupabaseProductRepository } from "@/src/infra/repositories/supabaseProductRepository";
import { SupabaseCategoryRepository } from "@/src/infra/repositories/supabaseCategoryRepository";
import { SupabaseShopProfileRepository } from "@/src/infra/repositories/supabaseShopProfileRepository";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop: lockedShopId } = await searchParams;

  const productRepository = new SupabaseProductRepository();
  const categoryRepository = new SupabaseCategoryRepository();
  const shopProfileRepository = new SupabaseShopProfileRepository();

  const productUseCase = new LoadProductCatalogUseCase(productRepository);
  const productController = new ProductCatalogController(productUseCase);
  const categoryController = new CategoryController(categoryRepository);
  const shopProfileController = new ShopProfileController(
    new LoadShopProfilesUseCase(shopProfileRepository)
  );

  const [products, categories, shops] = await Promise.all([
    productController.getCatalog(lockedShopId ?? null),
    categoryController.getAllCategories(lockedShopId ?? null),
    shopProfileController.getAllShops(),
  ]);

  return (
    <ProductCatalogPage
      products={products}
      categories={categories}
      shops={shops}
      lockedShopId={lockedShopId ?? null}
    />
  );
}
