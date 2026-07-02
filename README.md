# AKANE 茜 — Sushi, Tribeca

A full-stack restaurant website with reservations, email confirmations, and a protected admin dashboard.

**Live demo:** [akane.nickfurr.com](https://akane.nickfurr.com)

---

## About

AKANE is the website for a counter-first sushi restaurant in Tribeca — a production-style build, not a template or tutorial. The booking form writes to a real PostgreSQL database, confirmation emails send through Resend, and the admin area sits behind real authentication.

The brand is deliberately specific: a dark, crimson-accented Japanese aesthetic ("akane" is the red of the sky the moment it burns), carried through a real design system rather than placeholder styling.

Built by [Nick Furr](https://nickfurr.com).

---

## Features

- **Online reservations** — guests submit booking requests through a public form; data is validated server-side and written to a PostgreSQL database
- **Email confirmations** — a transactional confirmation email is sent to guests immediately after booking via Resend, including a unique booking reference
- **Admin reservations** — password-protected area where staff view reservations and confirm or cancel them
- **Public menu** — full menu fetched live from the database, grouped by category (appetizers, mains, desserts, drinks)
- **Multi-page public site** — homepage with menu preview, about page, contact page, and booking page, plus a custom 404 and a generated OpenGraph share image
- **AKANE design system** — a cohesive dark + crimson Japanese aesthetic defined in `globals.css`, layered serif (Cormorant Garamond / Shippori Mincho), sans (Inter), and mono (JetBrains Mono) typography
- **Two-layer auth** — proxy-level redirect guard plus server component session check on every admin route

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19, Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Email | Resend |
| Deployment | Vercel |

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Restaurant config
NEXT_PUBLIC_RESTAURANT_ID=   # UUID of the row in the restaurants table
RESTAURANT_NAME=             # e.g. "AKANE"
NEXT_PUBLIC_APP_URL=         # e.g. http://localhost:3000
```

You'll need a Supabase project with the migrations in `supabase/migrations/` applied, and a row inserted into the `restaurants` table. The `NEXT_PUBLIC_RESTAURANT_ID` must match that row's UUID.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/app/
  (site)/          Public-facing pages (/, /menu, /about, /contact, /booking)
  (admin)/         Protected admin pages (/admin, /admin/reservations) + /login
  api/reserve/     POST endpoint — validates and inserts reservations
src/emails/        Transactional email template (rendered by Resend)
src/lib/supabase/  Browser and server Supabase client helpers
supabase/
  migrations/      001_schema.sql (tables + triggers), 002_rls.sql (RLS policies)
```
