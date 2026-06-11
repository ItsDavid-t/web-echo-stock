export interface RecentProductsRepository {
  getRecentIds(): string[];
  trackProduct(productId: string): void;
}
