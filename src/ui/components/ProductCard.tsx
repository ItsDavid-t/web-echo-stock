import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";

export function ProductCard({
  product,
  showShopName = false,
  onOpen,
  animationDelay = 0,
}: {
  product: Product;
  shop?: ShopProfile | null;
  showShopName?: boolean;
  onOpen: () => void;
  animationDelay?: number;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${animationDelay}ms` }}
      className="animate-fade-up group w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-xl sm:p-5"
    >
      <img
        src={product.imgUrl}
        alt={product.name}
        className="mb-4 h-44 w-full rounded-2xl object-cover sm:h-52"
      />
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
              {product.categoryName ?? product.category ?? "Sin categoría"}
            </p>
            {showShopName && product.shopName ? (
              <p className="truncate text-xs text-[var(--muted)]">
                {product.shopName}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Disponible
          </span>
        </div>
        <h2 className="line-clamp-2 text-lg font-semibold text-[var(--foreground)] sm:text-xl">
          {product.name}
        </h2>
        <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
          {product.description ?? "Toca para ver detalles y contactar."}
        </p>
        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="font-medium text-[var(--foreground)]">
            {product.price != null
              ? `${product.currency ?? "USD"} ${product.price.toFixed(2)}`
              : "Consultar precio"}
          </span>
          <span className="text-[var(--accent)] transition group-hover:translate-x-0.5">
            Ver más →
          </span>
        </div>
      </div>
    </button>
  );
}
