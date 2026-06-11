import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";

export class ShopDirectoryService {
  static resolveDirectory(
    shops: ShopProfile[],
    products: Product[]
  ): ShopProfile[] {
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
  }

  static toMap(shops: ShopProfile[]): Map<string, ShopProfile> {
    return new Map(shops.map((shop) => [shop.id, shop]));
  }
}
