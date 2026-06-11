import { ManageRecentProductsUseCase } from "@/src/usecases/manageRecentProductsUseCase";
import { LocalRecentProductsRepository } from "@/src/infra/repositories/localRecentProductsRepository";

let recentProductsUseCase: ManageRecentProductsUseCase | null = null;

export function getManageRecentProductsUseCase(): ManageRecentProductsUseCase {
  if (!recentProductsUseCase) {
    recentProductsUseCase = new ManageRecentProductsUseCase(
      new LocalRecentProductsRepository()
    );
  }

  return recentProductsUseCase;
}
