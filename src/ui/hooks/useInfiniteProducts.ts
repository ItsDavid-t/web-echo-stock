import { useEffect, useState } from "react";

const PAGE_SIZE = 12;

export function useInfiniteProducts<T>(items: T[]) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const remaining = items.length - visibleCount;

  const loadMore = () => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, items.length));
  };

  return {
    visibleItems,
    hasMore,
    remaining,
    loadMore,
    total: items.length,
    showing: visibleItems.length,
    pageSize: PAGE_SIZE,
  };
}
