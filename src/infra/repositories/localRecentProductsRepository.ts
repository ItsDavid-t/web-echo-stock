import type { RecentProductsRepository } from "@/src/domain/repositories/recentProductsRepository";

const STORAGE_KEY = "echo-stock-recently-viewed";
const MAX_ITEMS = 8;

export class LocalRecentProductsRepository implements RecentProductsRepository {
  getRecentIds(): string[] {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  }

  trackProduct(productId: string): void {
    if (typeof window === "undefined") {
      return;
    }

    const next = [
      productId,
      ...this.getRecentIds().filter((id) => id !== productId),
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
