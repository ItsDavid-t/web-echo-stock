import { useEffect, useState } from "react";
import {
  DEFAULT_PAGE_SIZE,
  PaginationService,
} from "@/src/domain/services/paginationService";

export function useInfiniteProducts<T>(items: T[]) {
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(DEFAULT_PAGE_SIZE);
  }, [items]);

  const visibleItems = PaginationService.slice(items, visibleCount);
  const hasMore = PaginationService.hasMore(visibleCount, items.length);
  const remaining = PaginationService.getRemaining(visibleCount, items.length);

  const loadMore = () => {
    setVisibleCount((current) =>
      PaginationService.getNextCount(current, items.length)
    );
  };

  return {
    visibleItems,
    hasMore,
    remaining,
    loadMore,
    total: items.length,
    showing: visibleItems.length,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
