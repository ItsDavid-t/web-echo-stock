import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";
import { supabaseFetch } from "@/src/infra/supabase/supabaseClient";

function normalizeStatus(value: unknown): Product["status"] {
  const status = String(value ?? "available").trim();
  if (status === "reserved") return "reserved";
  if (status === "outOfStock") return "outOfStock";
  return "available";
}

function resolveShopId(record: Record<string, unknown>): string | null {
  const value = record["shopId"] ?? record["shop_id"];
  return value == null ? null : String(value);
}

function resolveCreatedAt(record: Record<string, unknown>): string {
  const value = record["createdAt"] ?? record["created_at"];
  return value == null ? new Date().toISOString() : String(value);
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
    createdAt: resolveCreatedAt(record),
  };
}

const PRODUCT_QUERY_PATHS = [
  "Product?select=*&order=createdAt.desc",
  "Product?select=*&order=created_at.desc",
  "Product?select=*",
];

async function fetchProductsFromPaths(
  paths: string[]
): Promise<Product[]> {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      const response = await supabaseFetch<Record<string, unknown>[]>(path);
      if (!Array.isArray(response)) {
        continue;
      }
      return response.map(mapSupabaseProduct);
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Error desconocido en Supabase");
    }
  }

  throw lastError ?? new Error("No se pudieron cargar los productos");
}

function withShopFilter(path: string, shopId: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}shopId=eq.${encodeURIComponent(shopId)}`;
}

export class SupabaseProductRepository implements ProductRepository {
  async fetchAll(shopId?: string | null): Promise<Product[]> {
    if (!shopId) {
      return fetchProductsFromPaths(PRODUCT_QUERY_PATHS);
    }

    const shopPaths = [
      ...PRODUCT_QUERY_PATHS.map((path) => withShopFilter(path, shopId)),
      ...PRODUCT_QUERY_PATHS.map((path) =>
        `${path}${path.includes("?") ? "&" : "?"}shop_id=eq.${encodeURIComponent(shopId)}`
      ),
    ];

    return fetchProductsFromPaths(shopPaths);
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
