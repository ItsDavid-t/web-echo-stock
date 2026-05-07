import type { Product } from "@/src/domain/entities/product";
import type { ProductRepository } from "@/src/domain/repositories/productRepository";
import { supabaseFetch } from "@/src/lib/supabase";

function normalizeStatus(value: unknown): Product["status"] {
  const status = String(value ?? "available");
  if (status === "reserved") return "reserved";
  if (status === "outOfStock") return "outOfStock";
  return "available";
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
    categoryName: null,
    imgUrl:
      String(record["imgUrl"] ?? "") ||
      "https://via.placeholder.com/320x240?text=Sin+imagen",
    status: normalizeStatus(record["status"]),
    createdAt: String(record["createdAt"] ?? new Date().toISOString()),
  };
}

export class SupabaseProductRepository implements ProductRepository {
  async fetchAll(): Promise<Product[]> {
    const response = await supabaseFetch<Record<string, unknown>[]>(
      "Product?select=id,name,description,classification,categoryId,imgUrl,status,createdAt&order=createdAt.desc"
    );

    return response.map(mapSupabaseProduct);
  }

  async fetchById(id: string): Promise<Product | null> {
    const response = await supabaseFetch<Record<string, unknown>[]>(
      `Product?select=id,name,description,classification,categoryId,imgUrl,status,createdAt&eq(id,${encodeURIComponent(
        id
      )})&limit=1`
    );

    if (!response.length) {
      return null;
    }

    return mapSupabaseProduct(response[0]);
  }
}
