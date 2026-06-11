import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { LoadShopProfilesUseCase } from "@/src/usecases/loadShopProfilesUseCase";

export class ShopProfileController {
  constructor(private readonly loadShopProfilesUseCase: LoadShopProfilesUseCase) {}

  async getAllShops(): Promise<ShopProfile[]> {
    return this.loadShopProfilesUseCase.execute();
  }
}
