"use client";

import { useCallback, useMemo, useState } from "react";
import type { Product } from "@/src/domain/entities/product";
import { getManageRecentProductsUseCase } from "@/src/infra/di/clientContainer";

const recentProductsUseCase = getManageRecentProductsUseCase();

export function useRecentlyViewed(products: Product[]) {
  const [revision, setRevision] = useState(0);

  const recentProducts = useMemo(
    () => recentProductsUseCase.getRecentProducts(products),
    [products, revision]
  );

  const trackProduct = useCallback((productId: string) => {
    recentProductsUseCase.track(productId);
    setRevision((value) => value + 1);
  }, []);

  return { recentProducts, trackProduct };
}
