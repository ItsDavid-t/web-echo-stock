import type { Product } from "@/src/domain/entities/product";
import type { CatalogViewMode } from "@/src/domain/types/catalog";
import { ProductCatalogGrid } from "@/src/ui/components/ProductCatalogGrid";

type CatalogResultsSectionProps = {
  visibleProducts: Product[];
  viewMode: CatalogViewMode;
  showShopName: boolean;
  hasMore: boolean;
  remaining: number;
  showing: number;
  total: number;
  onLoadMore: () => void;
  onOpenProduct: (product: Product) => void;
};

export function CatalogResultsSection({
  visibleProducts,
  viewMode,
  showShopName,
  hasMore,
  remaining,
  showing,
  total,
  onLoadMore,
  onOpenProduct,
}: CatalogResultsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <p>
          Mostrando{" "}
          <span className="font-medium text-[var(--foreground)]">{showing}</span>{" "}
          de <span className="font-medium text-[var(--foreground)]">{total}</span>
        </p>
        {hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            className="font-medium text-[var(--accent)]"
          >
            +{Math.min(remaining, 12)} más
          </button>
        ) : null}
      </div>

      <ProductCatalogGrid
        products={visibleProducts}
        viewMode={viewMode}
        showShopName={showShopName}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onOpenProduct={onOpenProduct}
      />

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            className="min-h-[48px] rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
          >
            Cargar más productos ({remaining} restantes)
          </button>
        </div>
      ) : null}
    </section>
  );
}
