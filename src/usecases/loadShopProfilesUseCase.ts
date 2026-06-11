import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { ShopProfileRepository } from "@/src/domain/repositories/shopProfileRepository";

export class LoadShopProfilesUseCase {
  constructor(private readonly repository: ShopProfileRepository) {}

  async execute(): Promise<ShopProfile[]> {
    return this.repository.fetchAll();
  }
}
