-- Ejecuta esto en Supabase → SQL Editor para que la web pública pueda leer el catálogo.
-- La app admin usa usuario autenticado; la web usa rol anon y necesita permisos de lectura.

-- Moneda del precio de venta (USD, EUR, MLC, CUP, etc.)
ALTER TABLE public."Product"
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD';

GRANT SELECT ON TABLE public."Product" TO anon, authenticated;
GRANT SELECT ON TABLE public."Category" TO anon, authenticated;
GRANT SELECT ON TABLE public.shop_profile TO anon, authenticated;

ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_available_products" ON public."Product";
CREATE POLICY "public_read_available_products"
  ON public."Product"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'available' AND stock > 0);

DROP POLICY IF EXISTS "public_read_categories" ON public."Category";
CREATE POLICY "public_read_categories"
  ON public."Category"
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "shop_profile_public_read" ON public.shop_profile;
CREATE POLICY "shop_profile_public_read"
  ON public.shop_profile
  FOR SELECT
  TO anon, authenticated
  USING (true);
