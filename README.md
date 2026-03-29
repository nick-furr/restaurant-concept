# The Grand Table — Restaurant Concept

A full-stack restaurant website with real reservations, email confirmations, and a protected admin dashboard.

**Live demo:** [restaurant.nickfurr.com](https://restaurant.nickfurr.com)

---

## About

This is a concept project built by [Nick Furr](https://nickfurr.com) as a portfolio piece. It demonstrates a production-style restaurant website — not a template or tutorial. Every feature listed below is fully implemented: the booking form writes to a real database, the confirmation email actually sends, and the admin dashboard is protected behind real authentication.

---

## Features

- **Online reservations** — guests submit booking requests through a public form; data is validated server-side and written to a PostgreSQL database
- **Email confirmations** — a transactional confirmation email is sent to guests immediately after booking via Resend, including a unique booking reference
- **Admin dashboard** — password-protected area where restaurant staff can view reservations and update their status (confirm or cancel)
- **Public menu** — full menu fetched live from the database, grouped by category (appetizers, mains, desserts, drinks)
- **Multi-page public site** — homepage with menu preview, about page, contact page, and booking page; dark fine-dining aesthetic throughout
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
RESTAURANT_NAME=             # e.g. "The Grand Table"
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
