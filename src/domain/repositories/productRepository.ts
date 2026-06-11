import type { Product } from "@/src/domain/entities/product";

export interface ProductRepository {
  fetchAll(shopId?: string | null): Promise<Product[]>;
  fetchById(id: string): Promise<Product | null>;
}
