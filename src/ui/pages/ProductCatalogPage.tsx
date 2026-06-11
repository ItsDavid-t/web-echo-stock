"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { ProductCatalogGrid } from "@/src/ui/components/ProductCatalogGrid";
import { ShopSelector } from "@/src/ui/components/ShopSelector";
import { ThemeToggle } from "@/src/ui/components/ThemeToggle";
import Image from "next/image";

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

  const activeShopId = lockedShopId ?? selectedShopId;

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

  const categoryIdsToFilter = useMemo(() => {
    if (selectedCategoryId == null) {
      return null;
    }

    return [selectedCategoryId];
  }, [selectedCategoryId]);

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

        return {
          ...product,
          categoryName,
          shopName,
        };
      }),
    [shopScopedProducts, getRootCategory, shopsById]
  );

  const filteredProducts = useMemo(() => {
    return productsWithMetadata.filter((product) => {
      if (categoryIdsToFilter && product.categoryId != null) {
        const rootCategory = getRootCategory(product.categoryId);
        if (!categoryIdsToFilter.includes(rootCategory?.id ?? -1)) {
          return false;
        }
      }

      if (selectedClassification) {
        return product.classification === selectedClassification;
      }

      if (search.trim().length === 0) {
        return true;
      }

      const normalizedSearch = search.toLowerCase();
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
        String(product.shopName ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [
    search,
    selectedClassification,
    productsWithMetadata,
    categoryIdsToFilter,
    getRootCategory,
  ]);

  const pageTitle = activeShop?.shopName ?? "Catálogo de productos";
  const pageDescription =
    activeShop?.description ??
    (activeShopId
      ? "Explora los productos disponibles en esta tienda."
      : "Explora productos de todas las tiendas conectadas.");

  const handleShopSelect = (shopId: string | null) => {
    setSelectedShopId(shopId);
    setSelectedCategoryId(null);
    setSelectedClassification("");
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10">
        <div className="flex flex-col gap-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:justify-between">
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
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                  {pageTitle}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  {pageDescription}
                </p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="mb-10 space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="product-search">
            Buscar productos
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, categoría, tienda o clasificación"
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <div className="rounded-3xl bg-[var(--surface)] p-4 text-sm text-[var(--muted)] shadow-[var(--shadow)] sm:text-right">
            <p className="font-medium text-[var(--foreground)]">
              {filteredProducts.length}
            </p>
            <p>productos encontrados</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedCategoryId == null
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
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
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedCategoryId === category.id
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {classifications.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                Clasificaciones
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClassification("")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedClassification === ""
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  Todas
                </button>
                {classifications.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedClassification(value)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedClassification === value
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {filteredProducts.length > 0 ? (
        <ProductCatalogGrid
          products={filteredProducts}
          shopsById={shopsById}
          showShopName={!activeShopId}
        />
      ) : (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          No se encontraron productos para los filtros seleccionados.
        </div>
      )}
    </main>
  );
}
