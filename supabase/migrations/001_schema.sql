-- =============================================================================
-- 001_schema.sql
-- Core data model for the restaurant reservation system.
--
-- Design principles:
--   1. Multi-tenant from day one — each table has a restaurant_id foreign key.
--      Adding a second client is an INSERT into restaurants, not a refactor.
--   2. Enums for constrained values — status is enforced at the DB level,
--      not just in application code. Bad data cannot enter this column.
--   3. numeric(10,2) for money — NEVER use float for currency. Float arithmetic
--      is approximate. numeric is exact. This prevents rounding bugs in reports.
--   4. confirmation_sent_at as nullable timestamp — the failure-recovery hook.
--      If the DB write succeeds but the email call fails, this stays NULL.
--      A simple query ("reservations where confirmation_sent_at is null and
--      created_at > now() - interval '1 hour'") finds every guest who never
--      got their confirmation. Without this column you'd never know.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

CREATE TYPE reservation_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'no_show'
);

CREATE TYPE menu_category AS ENUM (
  'appetizer',
  'main',
  'dessert',
  'drink'
);


-- ---------------------------------------------------------------------------
-- RESTAURANTS
-- ---------------------------------------------------------------------------

CREATE TABLE restaurants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  email       text NOT NULL,
  phone       text,
  address     text,
  timezone    text NOT NULL DEFAULT 'America/New_York',
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- MENU ITEMS
-- ---------------------------------------------------------------------------

CREATE TABLE menu_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  price           numeric(10, 2) NOT NULL CHECK (price >= 0),
  category        menu_category NOT NULL,
  available       boolean NOT NULL DEFAULT true,
  display_order   integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- RESERVATIONS
-- ---------------------------------------------------------------------------

CREATE TABLE reservations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id         uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  guest_name            text NOT NULL,
  guest_email           text NOT NULL,
  guest_phone           text,
  reservation_date      date NOT NULL,
  reservation_time      time NOT NULL,
  party_size            integer NOT NULL CHECK (party_size BETWEEN 1 AND 20),
  special_requests      text,
  status                reservation_status NOT NULL DEFAULT 'pending',
  confirmation_sent_at  timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX idx_reservations_date
  ON reservations (restaurant_id, reservation_date);

CREATE INDEX idx_reservations_status
  ON reservations (restaurant_id, status);

CREATE INDEX idx_reservations_unconfirmed
  ON reservations (restaurant_id, created_at)
  WHERE confirmation_sent_at IS NULL;

CREATE INDEX idx_menu_items_order
  ON menu_items (restaurant_id, category, display_order);


-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();