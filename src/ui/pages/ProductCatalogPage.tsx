"use client";

import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { CatalogEmptyState } from "@/src/ui/components/catalog/CatalogEmptyState";
import { CatalogFiltersPanel } from "@/src/ui/components/catalog/CatalogFiltersPanel";
import { CatalogHeader } from "@/src/ui/components/catalog/CatalogHeader";
import { CatalogResultsSection } from "@/src/ui/components/catalog/CatalogResultsSection";
import { CatalogSearchToolbar } from "@/src/ui/components/catalog/CatalogSearchToolbar";
import { ProductDetailSheet } from "@/src/ui/components/ProductDetailSheet";
import { RecentlyViewedRow } from "@/src/ui/components/RecentlyViewedRow";
import { ScrollToTopButton } from "@/src/ui/components/ScrollToTopButton";
import { useProductCatalogViewModel } from "@/src/ui/hooks/useProductCatalogViewModel";

export function ProductCatalogPage({
  products,
  categories,
  shops,
  lockedShopId,
}: {
  products: Product[];
  categories: Category[];
  shops: ShopProfile[];
  lockedShopId: string | null;
}) {
  const viewModel = useProductCatalogViewModel({
    products,
    categories,
    shops,
    lockedShopId,
  });

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
        <CatalogHeader
          activeShop={viewModel.activeShop}
          pageContent={viewModel.pageContent}
        />

        <CatalogSearchToolbar
          search={viewModel.search}
          onSearchChange={viewModel.setSearch}
          sortBy={viewModel.sortBy}
          onSortChange={viewModel.setSortBy}
          viewMode={viewModel.viewMode}
          onViewModeChange={viewModel.setViewMode}
          total={viewModel.pagination.total}
          activeFiltersCount={viewModel.activeFiltersCount}
          filtersOpen={viewModel.filtersOpen}
          onToggleFilters={() => viewModel.setFiltersOpen((open) => !open)}
          onClearFilters={viewModel.clearFilters}
          stickyFilters={viewModel.stickyFilters}
          showShopSort={!viewModel.activeShopId}
        />

        <CatalogFiltersPanel
          isOpen={viewModel.filtersOpen}
          shops={viewModel.resolvedShops}
          selectedShopId={viewModel.activeShopId}
          lockedShopId={lockedShopId}
          onShopSelect={viewModel.handleShopSelect}
          rootCategories={viewModel.rootCategories}
          selectedCategoryId={viewModel.selectedCategoryId}
          onCategorySelect={viewModel.handleCategorySelect}
          classifications={viewModel.classifications}
          selectedClassification={viewModel.selectedClassification}
          onClassificationSelect={viewModel.setSelectedClassification}
        />

        {viewModel.recentProducts.length > 0 ? (
          <div className="mb-6">
            <RecentlyViewedRow
              products={viewModel.recentProducts}
              onOpen={viewModel.openProduct}
            />
          </div>
        ) : null}

        {viewModel.filteredProducts.length > 0 ? (
          <CatalogResultsSection
            visibleProducts={viewModel.pagination.visibleItems}
            viewMode={viewModel.viewMode}
            showShopName={!viewModel.activeShopId}
            hasMore={viewModel.pagination.hasMore}
            remaining={viewModel.pagination.remaining}
            showing={viewModel.pagination.showing}
            total={viewModel.pagination.total}
            onLoadMore={viewModel.pagination.loadMore}
            onOpenProduct={viewModel.openProduct}
          />
        ) : (
          <CatalogEmptyState
            hasSourceProducts={viewModel.hasSourceProducts}
            onClearFilters={viewModel.clearFilters}
          />
        )}
      </main>

      <ProductDetailSheet
        product={viewModel.selectedProduct}
        shop={viewModel.selectedShop}
        onClose={() => viewModel.setSelectedProduct(null)}
      />
      <ScrollToTopButton />
    </>
  );
}
