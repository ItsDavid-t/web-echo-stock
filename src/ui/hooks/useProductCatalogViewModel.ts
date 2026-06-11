"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { CatalogPageContentService } from "@/src/domain/services/catalogPageContentService";
import { CategoryTreeService } from "@/src/domain/services/categoryTreeService";
import { ProductCatalogService } from "@/src/domain/services/productCatalogService";
import { ShopDirectoryService } from "@/src/domain/services/shopDirectoryService";
import type { CatalogSort, CatalogViewMode } from "@/src/domain/types/catalog";
import { useDebouncedValue } from "@/src/ui/hooks/useDebouncedValue";
import { useInfiniteProducts } from "@/src/ui/hooks/useInfiniteProducts";
import { useRecentlyViewed } from "@/src/ui/hooks/useRecentlyViewed";

type UseProductCatalogViewModelParams = {
  products: Product[];
  categories: Category[];
  shops: ShopProfile[];
  lockedShopId: string | null;
};

export function useProductCatalogViewModel({
  products,
  categories,
  shops,
  lockedShopId,
}: UseProductCatalogViewModelParams) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    lockedShopId
  );
  const [sortBy, setSortBy] = useState<CatalogSort>("newest");
  const [viewMode, setViewMode] = useState<CatalogViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stickyFilters, setStickyFilters] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 280);
  const activeShopId = lockedShopId ?? selectedShopId;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const applyView = () => setViewMode(media.matches ? "grid" : "list");
    applyView();
    media.addEventListener("change", applyView);
    return () => media.removeEventListener("change", applyView);
  }, []);

  useEffect(() => {
    const onScroll = () => setStickyFilters(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resolvedShops = useMemo(
    () => ShopDirectoryService.resolveDirectory(shops, products),
    [shops, products]
  );

  const shopsById = useMemo(
    () => ShopDirectoryService.toMap(resolvedShops),
    [resolvedShops]
  );

  const activeShop = activeShopId ? shopsById.get(activeShopId) ?? null : null;

  const scopedProducts = useMemo(
    () => ProductCatalogService.scopeProducts(products, activeShopId),
    [products, activeShopId]
  );

  const scopedCategories = useMemo(
    () => ProductCatalogService.scopeCategories(categories, activeShopId),
    [categories, activeShopId]
  );

  const rootCategories = useMemo(
    () => CategoryTreeService.getRootCategories(scopedCategories),
    [scopedCategories]
  );

  const classifications = useMemo(
    () => ProductCatalogService.extractClassifications(scopedProducts),
    [scopedProducts]
  );

  const enrichedProducts = useMemo(
    () =>
      ProductCatalogService.enrichProducts(
        scopedProducts,
        scopedCategories,
        shopsById
      ),
    [scopedProducts, scopedCategories, shopsById]
  );

  const filteredProducts = useMemo(
    () =>
      ProductCatalogService.filterAndSort(
        enrichedProducts,
        scopedCategories,
        {
          search: debouncedSearch,
          categoryId: selectedCategoryId,
          classification: selectedClassification,
          shopId: activeShopId,
        },
        sortBy
      ),
    [
      enrichedProducts,
      scopedCategories,
      debouncedSearch,
      selectedCategoryId,
      selectedClassification,
      activeShopId,
      sortBy,
    ]
  );

  const pagination = useInfiniteProducts(filteredProducts);
  const { recentProducts, trackProduct } = useRecentlyViewed(enrichedProducts);

  const activeFiltersCount = ProductCatalogService.countActiveFilters(
    {
      search: debouncedSearch,
      categoryId: selectedCategoryId,
      classification: selectedClassification,
      shopId: activeShopId,
    },
    lockedShopId
  );

  const pageContent = CatalogPageContentService.build(activeShop, activeShopId);

  const handleShopSelect = (shopId: string | null) => {
    setSelectedShopId(shopId);
    setSelectedCategoryId(null);
    setSelectedClassification("");
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedClassification("");
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedClassification("");
    if (!lockedShopId) {
      setSelectedShopId(null);
    }
    setSearch("");
  };

  const openProduct = (product: Product) => {
    trackProduct(product.id);
    setSelectedProduct(product);
  };

  const selectedShop =
    selectedProduct?.shopId != null
      ? shopsById.get(selectedProduct.shopId) ?? null
      : null;

  return {
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedClassification,
    setSelectedClassification,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    filtersOpen,
    setFiltersOpen,
    selectedProduct,
    setSelectedProduct,
    stickyFilters,
    activeShopId,
    activeShop,
    resolvedShops,
    rootCategories,
    classifications,
    filteredProducts,
    pagination,
    recentProducts,
    activeFiltersCount,
    pageContent,
    handleShopSelect,
    handleCategorySelect,
    clearFilters,
    openProduct,
    selectedShop,
    hasSourceProducts: products.length > 0,
  };
}
