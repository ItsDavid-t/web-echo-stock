type CatalogEmptyStateProps = {
  hasSourceProducts: boolean;
  onClearFilters: () => void;
};

export function CatalogEmptyState({
  hasSourceProducts,
  onClearFilters,
}: CatalogEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
      <p className="text-base font-medium text-[var(--foreground)]">
        {hasSourceProducts
          ? "No encontramos productos con esos filtros."
          : "No hay productos disponibles en el catálogo público."}
      </p>
      {hasSourceProducts ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white"
        >
          Ver todos los productos
        </button>
      ) : null}
    </div>
  );
}
