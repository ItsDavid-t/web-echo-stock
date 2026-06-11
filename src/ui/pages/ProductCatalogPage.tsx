"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import {
  ProductCatalogGrid,
  type CatalogViewMode,
} from "@/src/ui/components/ProductCatalogGrid";
import { ProductDetailSheet } from "@/src/ui/components/ProductDetailSheet";
import { RecentlyViewedRow } from "@/src/ui/components/RecentlyViewedRow";
import { ScrollToTopButton } from "@/src/ui/components/ScrollToTopButton";
import { ShopSelector } from "@/src/ui/components/ShopSelector";
import { ThemeToggle } from "@/src/ui/components/ThemeToggle";
import { useDebouncedValue } from "@/src/ui/hooks/useDebouncedValue";
import { useInfiniteProducts } from "@/src/ui/hooks/useInfiniteProducts";
import { useRecentlyViewed } from "@/src/ui/hooks/useRecentlyViewed";
import Image from "next/image";

type SortOption = "newest" | "name" | "shop";

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
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedClassification, setSelectedClassification] = useState<string>(
    ""
  );
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    lockedShopId
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<CatalogViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stickyFilters, setStickyFilters] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 280);
  const { trackProduct, getRecentProducts } = useRecentlyViewed();

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

  const resolvedShops = useMemo(() => {
    const shopMap = new Map(shops.map((shop) => [shop.id, shop]));

    for (const product of products) {
      if (product.shopId && !shopMap.has(product.shopId)) {
        shopMap.set(product.shopId, {
          id: product.shopId,
          shopName: `Tienda ${product.shopId.slice(0, 8)}`,
          whatsappNumber: "",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return Array.from(shopMap.values()).sort((a, b) =>
      a.shopName.localeCompare(b.shopName)
    );
  }, [shops, products]);

  const shopsById = useMemo(
    () => new Map(resolvedShops.map((shop) => [shop.id, shop])),
    [resolvedShops]
  );

  const activeShop = activeShopId ? shopsById.get(activeShopId) : null;

  const shopScopedProducts = useMemo(() => {
    if (!activeShopId) {
      return products;
    }
    return products.filter((product) => product.shopId === activeShopId);
  }, [products, activeShopId]);

  const shopScopedCategories = useMemo(() => {
    if (!activeShopId) {
      return categories;
    }
    return categories.filter((category) => category.shopId === activeShopId);
  }, [categories, activeShopId]);

  const categoriesById = useMemo(
    () =>
      new Map(shopScopedCategories.map((category) => [category.id, category])),
    [shopScopedCategories]
  );

  const getRootCategory = useMemo(
    () =>
      (categoryId: number): Category | null => {
        let currentCategory = categoriesById.get(categoryId);
        while (currentCategory && currentCategory.parentId != null) {
          currentCategory = categoriesById.get(currentCategory.parentId);
        }
        return currentCategory || null;
      },
    [categoriesById]
  );

  const rootCategories = useMemo(
    () =>
      shopScopedCategories.filter((category) => category.parentId == null),
    [shopScopedCategories]
  );

  const classifications = useMemo(
    () =>
      Array.from(
        new Set(
          shopScopedProducts
            .map((product) => product.classification?.trim() ?? "")
            .filter((value) => value.length > 0)
        )
      ),
    [shopScopedProducts]
  );

  const productsWithMetadata = useMemo(
    () =>
      shopScopedProducts.map((product) => {
        let categoryName: string =
          product.categoryName || product.category || "";

        if (!categoryName && product.categoryId != null) {
          const rootCategory = getRootCategory(product.categoryId);
          categoryName = rootCategory?.name || "";
        }

        if (!categoryName) {
          categoryName = "Sin categoría";
        }

        const shopName =
          product.shopId != null
            ? shopsById.get(product.shopId)?.shopName ?? null
            : null;

        return { ...product, categoryName, shopName };
      }),
    [shopScopedProducts, getRootCategory, shopsById]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filtered = productsWithMetadata.filter((product) => {
      if (selectedCategoryId != null && product.categoryId != null) {
        const rootCategory = getRootCategory(product.categoryId);
        if (rootCategory?.id !== selectedCategoryId) {
          return false;
        }
      }

      if (
        selectedClassification &&
        product.classification !== selectedClassification
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(normalizedSearch) ||
        String(product.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(product.categoryName ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(product.classification ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(product.shopName ?? "").toLowerCase().includes(normalizedSearch)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "shop") {
        return String(a.shopName ?? "").localeCompare(String(b.shopName ?? ""));
      }
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [
    debouncedSearch,
    selectedClassification,
    selectedCategoryId,
    productsWithMetadata,
    getRootCategory,
    sortBy,
  ]);

  const {
    visibleItems,
    hasMore,
    loadMore,
    total,
    showing,
    remaining,
  } = useInfiniteProducts(filteredProducts);

  const recentProducts = getRecentProducts(productsWithMetadata);

  const activeFiltersCount =
    (selectedCategoryId != null ? 1 : 0) +
    (selectedClassification ? 1 : 0) +
    (activeShopId && !lockedShopId ? 1 : 0);

  const pageTitle = activeShop?.shopName ?? "Catálogo de productos";
  const pageDescription =
    activeShop?.description ??
    (activeShopId
      ? "Explora los productos disponibles en esta tienda."
      : "Descubre productos de varias tiendas en un solo lugar.");

  const handleShopSelect = (shopId: string | null) => {
    setSelectedShopId(shopId);
    setSelectedCategoryId(null);
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
      ? shopsById.get(selectedProduct.shopId)
      : null;

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              {activeShop?.logoUrl ? (
                <img
                  src={activeShop.logoUrl}
                  alt={activeShop.shopName}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <Image
                  src="/app_icon.png"
                  alt="Echo Stock"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
              )}
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
                  {activeShop ? activeShop.shopName : "Echo Stock"}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                  {pageTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  {pageDescription}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar producto, tienda o categoría..."
                className="min-h-[48px] flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
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
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none"
                aria-label="Ordenar productos"
              >
                <option value="newest">Más recientes</option>
                <option value="name">Nombre A-Z</option>
                {!activeShopId ? (
                  <option value="shop">Por tienda</option>
                ) : null}
              </select>
              <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
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
                  onClick={() => setViewMode("grid")}
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
                  onClick={clearFilters}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <section
          className={`mb-6 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] sm:p-5 ${
            filtersOpen ? "block" : "hidden sm:block"
          }`}
        >
          <ShopSelector
            shops={resolvedShops}
            selectedShopId={activeShopId}
            onSelect={handleShopSelect}
            lockedShopId={lockedShopId}
          />

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
              Categorías
            </p>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
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
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setSelectedClassification("");
                  }}
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
                  onClick={() => setSelectedClassification("")}
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
                    onClick={() => setSelectedClassification(value)}
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

        {recentProducts.length > 0 ? (
          <div className="mb-6">
            <RecentlyViewedRow
              products={recentProducts}
              onOpen={openProduct}
            />
          </div>
        ) : null}

        {filteredProducts.length > 0 ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <p>
                Mostrando <span className="font-medium text-[var(--foreground)]">{showing}</span> de{" "}
                <span className="font-medium text-[var(--foreground)]">{total}</span>
              </p>
              {hasMore ? (
                <button
                  type="button"
                  onClick={loadMore}
                  className="font-medium text-[var(--accent)]"
                >
                  +{Math.min(remaining, 12)} más
                </button>
              ) : null}
            </div>

            <ProductCatalogGrid
              products={visibleItems}
              viewMode={viewMode}
              showShopName={!activeShopId}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onOpenProduct={openProduct}
            />

            {hasMore ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={loadMore}
                  className="min-h-[48px] rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                >
                  Cargar más productos ({remaining} restantes)
                </button>
              </div>
            ) : null}
          </section>
        ) : (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
            <p className="text-base font-medium text-[var(--foreground)]">
              {products.length === 0
                ? "No hay productos disponibles en el catálogo público."
                : "No encontramos productos con esos filtros."}
            </p>
            {products.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white"
              >
                Ver todos los productos
              </button>
            ) : null}
          </div>
        )}
      </main>

      <ProductDetailSheet
        product={selectedProduct}
        shop={selectedShop}
        onClose={() => setSelectedProduct(null)}
      />
      <ScrollToTopButton />
    </>
  );
}
