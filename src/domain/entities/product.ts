export type ProductStatus = "available" | "reserved" | "outOfStock";

/** Producto público del catálogo (solo campos visibles al cliente). */
export type Product = {
  id: string;
  name: string;
  description?: string | null;
  classification?: string | null;
  categoryId?: number | null;
  category?: string;
  categoryName?: string | null;
  shopId?: string | null;
  shopName?: string | null;
  imgUrl: string;
  status: ProductStatus;
  createdAt: string;
  /** Precio de venta al público (sell_price en Supabase). */
  price?: number;
  /** Moneda del precio (USD, EUR, MLC, CUP, etc.). */
  currency?: string;
};
