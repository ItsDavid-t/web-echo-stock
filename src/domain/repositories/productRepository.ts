import type { Product } from "@/src/domain/entities/product";

export interface ProductRepository {
  fetchAll(): Promise<Product[]>;
  fetchById(id: string): Promise<Product | null>;
}
