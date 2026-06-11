export const DEFAULT_PAGE_SIZE = 12;

export class PaginationService {
  static slice<T>(items: T[], visibleCount: number): T[] {
    return items.slice(0, visibleCount);
  }

  static getNextCount(
    currentCount: number,
    total: number,
    pageSize = DEFAULT_PAGE_SIZE
  ): number {
    return Math.min(currentCount + pageSize, total);
  }

  static hasMore(visibleCount: number, total: number): boolean {
    return visibleCount < total;
  }

  static getRemaining(visibleCount: number, total: number): number {
    return Math.max(total - visibleCount, 0);
  }
}
