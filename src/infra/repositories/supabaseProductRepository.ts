import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";
import { supabaseFetch } from "@/src/lib/supabase";

const PRODUCT_SELECT =
  "id,name,description,classification,categoryId,shop_id,imgUrl,status,createdAt";

function normalizeStatus(value: unknown): Product["status"] {
  const status = String(value ?? "available");
  if (status === "reserved") return "reserved";
  if (status === "outOfStock") return "outOfStock";
  return "available";
}

function resolveShopId(record: Record<string, unknown>): string | null {
  const value = record["shopId"] ?? record["shop_id"];
  return value == null ? null : String(value);
}

function mapSupabaseProduct(record: Record<string, unknown>): Product {
  return {
    id: String(record["id"] ?? ""),
    name: String(record["name"] ?? ""),
    description:
      record["description"] == null ? null : String(record["description"]),
    classification:
      record["classification"] == null
        ? null
        : String(record["classification"]),
    categoryId:
      record["categoryId"] == null ? null : Number(record["categoryId"]),
    shopId: resolveShopId(record),
    categoryName: null,
    imgUrl:
      String(record["imgUrl"] ?? "") ||
      "https://via.placeholder.com/320x240?text=Sin+imagen",
    status: normalizeStatus(record["status"]),
    createdAt: String(record["createdAt"] ?? new Date().toISOString()),
  };
}

export class SupabaseProductRepository implements ProductRepository {
  async fetchAll(shopId?: string | null): Promise<Product[]> {
    const shopFilter = shopId
      ? `&shop_id=eq.${encodeURIComponent(shopId)}`
      : "";
    const response = await supabaseFetch<Record<string, unknown>[]>(
      `Product?select=${PRODUCT_SELECT}&order=createdAt.desc${shopFilter}`
    );

    return response.map(mapSupabaseProduct);
  }

  async fetchById(id: string): Promise<Product | null> {
    const response = await supabaseFetch<Record<string, unknown>[]>(
      `Product?select=${PRODUCT_SELECT}&eq(id,${encodeURIComponent(
        id
      )})&limit=1`
    );

    if (!response.length) {
      return null;
    }

    return mapSupabaseProduct(response[0]);
  }
}
