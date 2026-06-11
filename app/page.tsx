import { ProductCatalogPage } from "@/src/ui/pages/ProductCatalogPage";
import { ProductCatalogController } from "@/src/interfaces/controllers/productCatalogController";
import { CategoryController } from "@/src/interfaces/controllers/categoryController";
import { ShopProfileController } from "@/src/interfaces/controllers/shopProfileController";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";
import { LoadShopProfilesUseCase } from "@/src/usecases/loadShopProfilesUseCase";
import { SupabaseProductRepository } from "@/src/infra/repositories/supabaseProductRepository";
import { SupabaseCategoryRepository } from "@/src/infra/repositories/supabaseCategoryRepository";
import { SupabaseShopProfileRepository } from "@/src/infra/repositories/supabaseShopProfileRepository";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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

  try {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido al cargar datos";

    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-red-300 bg-red-50 p-8 text-red-900">
          <h1 className="text-2xl font-semibold">No se pudo cargar el catálogo</h1>
          <p className="mt-3 text-sm leading-6">{message}</p>
        </div>
      </main>
    );
  }
}
