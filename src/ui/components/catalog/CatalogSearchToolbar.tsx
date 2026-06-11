import type { CatalogSort, CatalogViewMode } from "@/src/domain/types/catalog";

type CatalogSearchToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: CatalogSort;
  onSortChange: (value: CatalogSort) => void;
  viewMode: CatalogViewMode;
  onViewModeChange: (value: CatalogViewMode) => void;
  total: number;
  activeFiltersCount: number;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  stickyFilters: boolean;
  showShopSort: boolean;
};

export function CatalogSearchToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  total,
  activeFiltersCount,
  filtersOpen,
  onToggleFilters,
  onClearFilters,
  stickyFilters,
  showShopSort,
}: CatalogSearchToolbarProps) {
  return (
    <div
      className={`sticky top-0 z-40 -mx-4 mb-5 border-b border-transparent px-4 py-3 transition sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 ${
        stickyFilters
          ? "border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md"
          : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="product-search">
            Buscar productos
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar producto, tienda o categoría..."
            className="min-h-[48px] flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <button
            type="button"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--foreground)] sm:hidden"
          >
            Filtros
            {activeFiltersCount > 0 ? (
              <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)]">
            {total} encontrados
          </span>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as CatalogSort)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none"
            aria-label="Ordenar productos"
          >
            <option value="newest">Más recientes</option>
            <option value="name">Nombre A-Z</option>
            {showShopSort ? <option value="shop">Por tienda</option> : null}
          </select>
          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 sm:flex">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`rounded-full px-3 py-1 text-xs ${
                viewMode === "list"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              Lista
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-full px-3 py-1 text-xs ${
                viewMode === "grid"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              Cuadrícula
            </button>
          </div>
          {activeFiltersCount > 0 ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
