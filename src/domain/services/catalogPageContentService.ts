import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { CatalogPageContent } from "@/src/domain/types/catalog";

export class CatalogPageContentService {
  static build(
    activeShop: ShopProfile | null,
    activeShopId: string | null
  ): CatalogPageContent {
    if (activeShop) {
      return {
        badgeLabel: activeShop.shopName,
        title: activeShop.shopName,
        description:
          activeShop.description ??
          "Explora los productos disponibles en esta tienda.",
      };
    }

    return {
      badgeLabel: "Echo Stock",
      title: "Catálogo de productos",
      description: activeShopId
        ? "Explora los productos disponibles en esta tienda."
        : "Descubre productos de varias tiendas en un solo lugar.",
    };
  }
}
