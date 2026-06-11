import type { Category } from "@/src/domain/entities/category";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { ShopSelector } from "@/src/ui/components/ShopSelector";

type CatalogFiltersPanelProps = {
  isOpen: boolean;
  shops: ShopProfile[];
  selectedShopId: string | null;
  lockedShopId: string | null;
  onShopSelect: (shopId: string | null) => void;
  rootCategories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  classifications: string[];
  selectedClassification: string;
  onClassificationSelect: (value: string) => void;
};

export function CatalogFiltersPanel({
  isOpen,
  shops,
  selectedShopId,
  lockedShopId,
  onShopSelect,
  rootCategories,
  selectedCategoryId,
  onCategorySelect,
  classifications,
  selectedClassification,
  onClassificationSelect,
}: CatalogFiltersPanelProps) {
  return (
    <section
      className={`mb-6 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] sm:p-5 ${
        isOpen ? "block" : "hidden sm:block"
      }`}
    >
      <ShopSelector
        shops={shops}
        selectedShopId={selectedShopId}
        onSelect={onShopSelect}
        lockedShopId={lockedShopId}
      />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
          Categorías
        </p>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onCategorySelect(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              selectedCategoryId == null
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]"
            }`}
          >
            Todas
          </button>
          {rootCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategorySelect(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                selectedCategoryId === category.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-strong)] text-[var(--foreground)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {classifications.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
            Clasificaciones
          </p>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => onClassificationSelect("")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                selectedClassification === ""
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-strong)] text-[var(--foreground)]"
              }`}
            >
              Todas
            </button>
            {classifications.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onClassificationSelect(value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  selectedClassification === value
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-strong)] text-[var(--foreground)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
