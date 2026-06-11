export type CatalogSort = "newest" | "name" | "shop";

export type CatalogViewMode = "grid" | "list";

export type CatalogFilters = {
  search: string;
  categoryId: number | null;
  classification: string;
  shopId: string | null;
};

export type CatalogPageContent = {
  title: string;
  description: string;
  badgeLabel: string;
};

export type WhatsAppContact = {
  phoneNumber: string;
  url: string;
  message: string;
};
