-- =============================================================================
-- 002_rls.sql
-- Row Level Security policies.
-- Kept separate from schema — different concern, different review process.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- ENABLE RLS
-- ---------------------------------------------------------------------------

ALTER TABLE restaurants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- RESTAURANTS — public read, no public write
-- ---------------------------------------------------------------------------

CREATE POLICY "restaurants_public_read"
  ON restaurants FOR SELECT
  TO anon, authenticated
  USING (true);


-- ---------------------------------------------------------------------------
-- MENU ITEMS
-- ---------------------------------------------------------------------------

CREATE POLICY "menu_items_public_read"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (available = true);

CREATE POLICY "menu_items_owner_write"
  ON menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- RESERVATIONS
-- ---------------------------------------------------------------------------

CREATE POLICY "reservations_guest_insert"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "reservations_owner_read"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "reservations_owner_update"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);