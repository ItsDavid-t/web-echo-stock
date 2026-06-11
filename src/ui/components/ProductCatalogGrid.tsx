import { useEffect, useRef } from "react";
import type { Product } from "@/src/domain/entities/product";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";

export type CatalogViewMode = "grid" | "list";

export function ProductCatalogGrid({
  products,
  viewMode,
  showShopName = false,
  hasMore,
  onLoadMore,
  onOpenProduct,
}: {
  products: Product[];
  viewMode: CatalogViewMode;
  showShopName?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenProduct: (product: Product) => void;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, products.length]);

  if (viewMode === "list") {
    return (
      <section className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            <ProductListItem
              product={product}
              showShopName={showShopName}
              onOpen={() => onOpenProduct(product)}
            />
          </div>
        ))}
        {hasMore ? <div ref={sentinelRef} className="h-8" aria-hidden /> : null}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          showShopName={showShopName}
          onOpen={() => onOpenProduct(product)}
          animationDelay={Math.min(index, 8) * 40}
        />
      ))}
      {hasMore ? (
        <div ref={sentinelRef} className="col-span-full h-8" aria-hidden />
      ) : null}
    </section>
  );
}
