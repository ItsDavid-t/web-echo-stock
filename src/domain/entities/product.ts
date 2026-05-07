export type ProductStatus = "available" | "reserved" | "outOfStock";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  classification?: string | null;
  categoryId?: number | null;
  category?: string;
  categoryName?: string | null;
  imgUrl: string;
  status: ProductStatus;
  createdAt: string;
  sku?: string;
  currency?: string;
  price?: number;
};
