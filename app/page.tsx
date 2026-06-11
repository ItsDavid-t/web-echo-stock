import { ProductCatalogPage } from "@/src/ui/pages/ProductCatalogPage";
import { createServerContainer } from "@/src/infra/di/serverContainer";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop: lockedShopId } = await searchParams;
  const { catalogDataController } = createServerContainer();

  try {
    const { products, categories, shops } =
      await catalogDataController.getCatalogData(lockedShopId ?? null);

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
