import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { ProductCard } from "./ProductCard";

export function ProductCatalogGrid({
  products,
  shopsById,
  showShopName = false,
}: {
  products: Product[];
  shopsById: Map<string, ShopProfile>;
  showShopName?: boolean;
}) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          shop={product.shopId ? shopsById.get(product.shopId) : null}
          showShopName={showShopName}
        />
      ))}
    </section>
  );
}
