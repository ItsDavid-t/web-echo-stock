import type { Product } from "@/src/domain/entities/product";
import { formatPublicPrice } from "@/src/domain/services/formatPublicPrice";

export function ProductListItem({
  product,
  showShopName = false,
  onOpen,
}: {
  product: Product;
  showShopName?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
    >
      <img
        src={product.imgUrl}
        alt={product.name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
          {product.categoryName ?? "Sin categoría"}
        </p>
        <h3 className="truncate text-base font-semibold text-[var(--foreground)]">
          {product.name}
        </h3>
        <p className="line-clamp-1 text-sm text-[var(--muted)]">
          {product.description ?? "Toca para ver detalles"}
        </p>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {formatPublicPrice(product.price, product.currency)}
        </p>
        {showShopName && product.shopName ? (
          <p className="truncate text-xs text-[var(--muted)]">{product.shopName}</p>
        ) : null}
      </div>
      <span className="shrink-0 text-xl text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
        →
      </span>
    </button>
  );
}
