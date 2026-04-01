-- ============================================================
-- RLS Policies para la tabla `products` (Lechona)
-- Ejecuta en Supabase: SQL Editor → New query → Pegar → Run
-- ============================================================

-- Quitar policies anteriores (anon)
DROP POLICY IF EXISTS "products_select_anon" ON public.products;
DROP POLICY IF EXISTS "products_insert_anon" ON public.products;
DROP POLICY IF EXISTS "products_update_anon" ON public.products;
DROP POLICY IF EXISTS "products_delete_anon" ON public.products;

-- Quitar policies para authenticated (por si ya existían)
DROP POLICY IF EXISTS "products_select_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_insert_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_update_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_delete_authenticated" ON public.products;

-- ========== ROL: anon (cliente con anon key, sin login Supabase Auth) ==========
CREATE POLICY "products_select_anon"
ON public.products FOR SELECT TO anon USING (true);

CREATE POLICY "products_insert_anon"
ON public.products FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "products_update_anon"
ON public.products FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "products_delete_anon"
ON public.products FOR DELETE TO anon USING (true);

-- ========== ROL: authenticated (por si el cliente va como usuario autenticado) ==========
CREATE POLICY "products_select_authenticated"
ON public.products FOR SELECT TO authenticated USING (true);

CREATE POLICY "products_insert_authenticated"
ON public.products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "products_update_authenticated"
ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "products_delete_authenticated"
ON public.products FOR DELETE TO authenticated USING (true);

-- Comprobar: deberías ver 8 filas (4 anon + 4 authenticated)
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'products';
