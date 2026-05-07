import type { Product } from "@/src/domain/entities/product";
import { ProductCard } from "./ProductCard";

export function ProductCatalogGrid({ products }: { products: Product[] }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
