import type { ShopProfile } from "@/src/domain/entities/shopProfile";

export function ShopSelector({
  shops,
  selectedShopId,
  onSelect,
  lockedShopId,
}: {
  shops: ShopProfile[];
  selectedShopId: string | null;
  onSelect: (shopId: string | null) => void;
  lockedShopId: string | null;
}) {
  if (lockedShopId) {
    const lockedShop = shops.find((shop) => shop.id === lockedShopId);
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 text-sm text-[var(--foreground)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
          Tienda
        </p>
        <p className="mt-1 font-medium">
          {lockedShop?.shopName ?? "Catálogo de tienda"}
        </p>
      </div>
    );
  }

  if (shops.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
        Tienda
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            selectedShopId == null
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
          }`}
        >
          Todas las tiendas
        </button>
        {shops.map((shop) => (
          <button
            key={shop.id}
            type="button"
            onClick={() => onSelect(shop.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedShopId === shop.id
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            {shop.shopName}
          </button>
        ))}
      </div>
    </div>
  );
}
