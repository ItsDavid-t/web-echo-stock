import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";
import { supabaseFetch } from "@/src/infra/supabase/supabaseClient";


const PUBLIC_PRODUCT_COLUMNS = [
  "id",
  "name",
  "description",
  "classification",
  '"category_id"',
  "shop_id",
  '"img_url"',
  "status",
  '"created_at"',
  "sell_price",
  "currency",
  "stock",
].join(",");

const PUBLIC_PRODUCT_COLUMNS_WITHOUT_CURRENCY = [
  "id",
  "name",
  "description",
  "classification",
  '"category_id"',
  "shop_id",
  '"img_url"',
  "status",
  '"created_at"',
  "sell_price",
  "stock",
].join(",");

function buildProductQueryPaths(columns: string): string[] {
  return [
    `Product?select=${columns}&status=eq.available&stock=gt.0&order="created_at".desc`,
    `Product?select=${columns}&status=eq.available&stock=gt.0`,
    `Product?select=${columns}&order="created_at".desc`,
    `Product?select=${columns}`,
  ];
}

const PRODUCT_QUERY_PATHS = [
  ...buildProductQueryPaths(PUBLIC_PRODUCT_COLUMNS),
  ...buildProductQueryPaths(PUBLIC_PRODUCT_COLUMNS_WITHOUT_CURRENCY),
];

function normalizeStatus(value: unknown): Product["status"] {
  const status = String(value ?? "available").trim();
  if (status === "reserved") return "reserved";
  if (status === "outOfStock") return "outOfStock";
  return "available";
}

function resolveShopId(record: Record<string, unknown>): string | null {
  const value = record["shop_id"];
  return value == null ? null : String(value);
}

function resolveCreatedAt(record: Record<string, unknown>): string {
  const value = record["created_at"];
  return value == null ? new Date().toISOString() : String(value);
}

function resolveSellPrice(record: Record<string, unknown>): number | undefined {
  const raw = record["sell_price"];
  if (raw == null) return undefined;

  const price = Number(raw);
  if (!Number.isFinite(price) || price <= 0) return undefined;

  return price;
}

function resolveCurrency(record: Record<string, unknown>): string {
  const raw = record["currency"];
  if (raw == null || String(raw).trim() === "") return "USD";
  return String(raw).trim().toUpperCase();
}

function isPubliclyVisible(record: Record<string, unknown>): boolean {
  const status = normalizeStatus(record["status"]);
  if (status !== "available") return false;

  if (record["stock"] == null) {
    return true;
  }

  return Number(record["stock"]) > 0;
}

function mapSupabaseProduct(record: Record<string, unknown>): Product | null {
  if (!isPubliclyVisible(record)) {
    return null;
  }

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
      record["category_id"] == null ? null : Number(record["category_id"]),
    shopId: resolveShopId(record),
    categoryName: null,
    imgUrl:
      String(record["img_url"] ?? "") ||
      "https://via.placeholder.com/320x240?text=Sin+imagen",
    status: normalizeStatus(record["status"]),
    createdAt: resolveCreatedAt(record),
    price: resolveSellPrice(record),
    currency: resolveCurrency(record),
  };
}

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

      return response
        .map(mapSupabaseProduct)
        .filter((product): product is Product => product != null);
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Error desconocido en Supabase");
    }
  }

  throw lastError ?? new Error("No se pudieron cargar los productos");
}

function withShopFilter(path: string, shopId: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}shop_id=eq.${encodeURIComponent(shopId)}`;
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
    const paths = [
      `Product?select=${PUBLIC_PRODUCT_COLUMNS}&id=eq.${encodeURIComponent(id)}&limit=1`,
      `Product?select=${PUBLIC_PRODUCT_COLUMNS_WITHOUT_CURRENCY}&id=eq.${encodeURIComponent(id)}&limit=1`,
    ];

    for (const path of paths) {
      try {
        const response = await supabaseFetch<Record<string, unknown>[]>(path);
        if (!response.length) {
          return null;
        }
        return mapSupabaseProduct(response[0]);
      } catch {
        // Intenta el siguiente select (p. ej. si falta la columna currency).
      }
    }

    return null;
  }
}
