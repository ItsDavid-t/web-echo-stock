import type { Product } from "@/src/domain/entities/product";
import { formatPublicPrice } from "@/src/domain/services/formatPublicPrice";

export function RecentlyViewedRow({
  products,
  onOpen,
}: {
  products: Product[];
  onOpen: (product: Product) => void;
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Vistos recientemente
        </h2>
        <span className="text-xs text-[var(--muted)]">Sigue donde lo dejaste</span>
      </div>
      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onOpen(product)}
            className="w-36 shrink-0 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
          >
            <img
              src={product.imgUrl}
              alt={product.name}
              className="h-24 w-full rounded-xl object-cover"
            />
            <p className="line-clamp-2 text-sm font-medium text-[var(--foreground)]">
              {product.name}
            </p>
            <p className="text-xs font-semibold text-[var(--accent)]">
              {formatPublicPrice(product.price, product.currency)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
