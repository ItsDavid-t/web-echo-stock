import type { CatalogData } from "@/src/usecases/loadCatalogDataUseCase";
import { LoadCatalogDataUseCase } from "@/src/usecases/loadCatalogDataUseCase";

export class CatalogDataController {
  constructor(private readonly loadCatalogDataUseCase: LoadCatalogDataUseCase) {}

  async getCatalogData(lockedShopId?: string | null): Promise<CatalogData> {
    return this.loadCatalogDataUseCase.execute(lockedShopId);
  }
}
