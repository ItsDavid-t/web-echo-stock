import type { ShopProfile } from "@/src/domain/entities/shopProfile";

export interface ShopProfileRepository {
  fetchAll(): Promise<ShopProfile[]>;
  fetchById(id: string): Promise<ShopProfile | null>;
}
