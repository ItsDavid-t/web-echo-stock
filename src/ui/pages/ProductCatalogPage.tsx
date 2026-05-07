"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/src/domain/entities/category";
import type { Product } from "@/src/domain/entities/product";
import { ProductCatalogGrid } from "@/src/ui/components/ProductCatalogGrid";
import { ThemeToggle } from "@/src/ui/components/ThemeToggle";
import Image from "next/image";

const formatStatusLabel = (status: Product["status"]) => {
  if (status === "reserved") return "Reservado";
  if (status === "outOfStock") return "Agotado";
  return "Disponible";
};

export function ProductCatalogPage({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedClassification, setSelectedClassification] = useState<string>(
    ""
  );

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const rootCategories = useMemo(
    () => categories.filter((category) => category.parentId == null),
    [categories]
  );

  const childCategories = useMemo(
    () =>
      selectedCategoryId == null
        ? []
        : categories.filter(
            (category) => category.parentId === selectedCategoryId
          ),
    [categories, selectedCategoryId]
  );

  const categoryIdsToFilter = useMemo(() => {
    if (selectedCategoryId == null) {
      return null;
    }

    const childIds = categories
      .filter((category) => category.parentId === selectedCategoryId)
      .map((category) => category.id);

    return [selectedCategoryId, ...childIds];
  }, [categories, selectedCategoryId]);

  const classifications = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.classification?.trim() ?? "")
            .filter((value) => value.length > 0)
        )
      ),
    [products]
  );

  const productsWithCategoryName = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        categoryName:
          product.categoryName ||
          product.category ||
          categoriesById.get(product.categoryId ?? -1)?.name ||
          "Sin categoría",
      })),
    [products, categoriesById]
  );

  const filteredProducts = useMemo(() => {
    return productsWithCategoryName.filter((product) => {
      if (categoryIdsToFilter && product.categoryId != null) {
        if (!categoryIdsToFilter.includes(product.categoryId)) {
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
        String(product.description ?? "").toLowerCase().includes(normalizedSearch) ||
        String(product.categoryName ?? "").toLowerCase().includes(normalizedSearch) ||
        String(product.classification ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, selectedCategoryId, selectedClassification, productsWithCategoryName, categoryIdsToFilter]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/app_icon.png"
              alt="Echo Stock"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
                Echo Stock
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                  Catálogo de productos
                </h1>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="mb-10 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="product-search">
            Buscar productos
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, categoría o clasificación"
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <div className="rounded-3xl bg-[var(--surface)] p-3 text-sm text-[var(--muted)] shadow-[var(--shadow)]">
            <p className="font-medium text-[var(--foreground)]">{filteredProducts.length}</p>
            <p>productos encontrados</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
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

          {selectedCategoryId != null && childCategories.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                Subcategorías
              </p>
              <div className="flex flex-wrap gap-2">
                {childCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="rounded-full bg-[var(--surface-alt)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface)]"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
        <ProductCatalogGrid products={filteredProducts} />
      ) : (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)] shadow-[var(--shadow)]">
          No se encontraron productos para los filtros seleccionados.
        </div>
      )}
    </main>
  );
}
