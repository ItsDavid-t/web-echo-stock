import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";
import { supabaseFetch } from "@/src/lib/supabase";

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

async function fetchProducts(path: string): Promise<Product[]> {
  const response = await supabaseFetch<Record<string, unknown>[]>(path);
  return response.map(mapSupabaseProduct);
}

export class SupabaseProductRepository implements ProductRepository {
  async fetchAll(shopId?: string | null): Promise<Product[]> {
    const basePath = "Product?select=*&order=createdAt.desc";

    if (!shopId) {
      return fetchProducts(basePath);
    }

    try {
      return await fetchProducts(
        `${basePath}&shopId=eq.${encodeURIComponent(shopId)}`
      );
    } catch {
      return fetchProducts(
        `${basePath}&shop_id=eq.${encodeURIComponent(shopId)}`
      );
    }
  }

  async fetchById(id: string): Promise<Product | null> {
    const response = await supabaseFetch<Record<string, unknown>[]>(
      `Product?select=*&eq(id,${encodeURIComponent(id)})&limit=1`
    );

    if (!response.length) {
      return null;
    }

    return mapSupabaseProduct(response[0]);
  }
}
