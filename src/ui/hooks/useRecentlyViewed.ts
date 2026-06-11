"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/src/domain/entities/product";

const STORAGE_KEY = "echo-stock-recently-viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentIds(JSON.parse(stored) as string[]);
      }
    } catch {
      setRecentIds([]);
    }
  }, []);

  const trackProduct = useCallback((productId: string) => {
    setRecentIds((current) => {
      const next = [productId, ...current.filter((id) => id !== productId)].slice(
        0,
        MAX_ITEMS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getRecentProducts = useCallback(
    (products: Product[]) => {
      const byId = new Map(products.map((product) => [product.id, product]));
      return recentIds
        .map((id) => byId.get(id))
        .filter((product): product is Product => product != null);
    },
    [recentIds]
  );

  return { trackProduct, getRecentProducts };
}
