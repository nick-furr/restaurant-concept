@AGENTS.md

---

# Project: The Grand Table

A restaurant reservation and management system. Guests book tables through a public-facing form; restaurant staff manage reservations through a private admin dashboard.

---

## Tech Stack

### Next.js 16 (App Router)
Chosen for its server-first rendering model, which lets auth checks and data fetching live in server components with no client-side waterfalls. The App Router's nested layouts are a natural fit for the admin/public split — one layout tree per section, each with its own auth behavior.

**Breaking change from common training data:** In Next.js 16, the `middleware.ts` file convention is deprecated and renamed to `proxy.ts`. The exported function must be named `proxy`, not `middleware`. A codemod is available: `npx @next/codemod@canary middleware-to-proxy .`

Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. The APIs and conventions in this version differ from what most LLM training data describes.

### React 19
Ships with Next.js 16. The React Compiler (`babel-plugin-react-compiler`) is enabled via `next.config.ts` — it handles memoization automatically. Do not manually add `useMemo`, `useCallback`, or `memo()` unless you have a measured reason.

### TypeScript 5 (strict mode)
`strict: true` is set in `tsconfig.json`. All code is fully typed. Do not use `any` or `// @ts-ignore` to paper over type errors — fix the underlying issue.

### Tailwind CSS v4
Configured via `@tailwindcss/postcss`. The CSS entry point is `src/app/globals.css` which contains a single line:

```css
@import "tailwindcss";
```

**Breaking change from v3:** There are no `@tailwind base/components/utilities` directives in v4. Do not add them.

### Supabase
PostgreSQL database with built-in auth, Row Level Security, and a generated TypeScript client. Chosen because it provides all the backend primitives (auth, database, realtime if needed) without running a separate API server.

### @supabase/ssr
The official Supabase library for SSR frameworks. It handles the complexity of reading and writing auth session cookies across server components, route handlers, and the proxy layer. Used instead of `@supabase/supabase-js` directly for anything that needs to respect the logged-in user's session.

### Resend
Transactional email for reservation confirmations. Fully wired — `POST /api/reserve` sends a confirmation email immediately after a successful insert. The `ConfirmationEmail` React component at `src/emails/ConfirmationEmail.tsx` is passed directly to `resend.emails.send({ react: ... })`. The `confirmation_sent_at` column is only set if the email send succeeds; a `NULL` value means the email was not sent and the reservation may need recovery (see API Route Design below).

### Vercel
The intended deployment target. No `vercel.json` is present — the Next.js defaults are sufficient. Secrets live in Vercel's environment variable UI, not committed to the repo.

---

## Architecture Decisions

### Multi-tenant schema from day one
Every data table (`reservations`, `menu_items`) has a `restaurant_id` foreign key. Adding a second restaurant is an `INSERT` into `restaurants`, not a refactor of the schema. See `supabase/migrations/001_schema.sql`.

### Enums for constrained values
`reservation_status` and `menu_category` are PostgreSQL enums, not freeform text. Invalid values are rejected at the database level, not just in application code. Application code can go wrong; the enum cannot.

### numeric(10,2) for prices, never float
`menu_items.price` is `numeric(10,2)`. Floating-point arithmetic is approximate and produces rounding errors in currency calculations. `numeric` is exact.

### Migrations split by concern
`001_schema.sql` defines tables, indexes, and triggers. `002_rls.sql` defines Row Level Security policies. These are different concerns with different review processes — someone auditing security shouldn't need to read trigger code at the same time.

### Two-layer auth
The proxy (`src/proxy.ts`) is the first layer — it intercepts every request to `/admin/*` and redirects to `/login?next=<pathname>` before any rendering begins. The admin layout (`src/app/(admin)/admin/layout.tsx`) is the second layer — it calls `getUser()` again and redirects if no session exists. The proxy is the fast path; the layout is belt-and-suspenders. **Neither layer alone is sufficient** — the proxy does not run for Server Actions, and the layout can be bypassed if the proxy is misconfigured.

### Why the admin layout is at `(admin)/admin/layout.tsx`, not `(admin)/layout.tsx`
The `(admin)` route group contains both the login page (`/login`) and the admin dashboard pages (`/admin/*`). A layout at `(admin)/layout.tsx` would wrap both. If that layout redirected unauthenticated users to `/login`, the login page itself would be subject to the redirect — infinite loop. Placing the layout one level deeper at `(admin)/admin/layout.tsx` scopes the auth check to `/admin` and its children only, leaving `/login` untouched.

```
src/app/
  (admin)/
    login/page.tsx          ← URL /login  — NOT wrapped by auth layout
    admin/
      layout.tsx            ← auth check + sidebar, applies to /admin/*
      page.tsx              ← URL /admin
      reservations/
        page.tsx            ← URL /admin/reservations
```

### `router.replace` after login, not `router.push`
After a successful sign-in, the login page does `router.replace(next)` instead of `router.push(next)`. This removes the login page from the browser history stack — pressing Back after signing in will not return to the login screen.

### `useSearchParams` wrapped in Suspense
In Next.js 16, `useSearchParams()` causes client-side rendering up to the nearest Suspense boundary during prerendering. The login page splits into `LoginPage` (the outer shell, wraps in `<Suspense>`) and `LoginForm` (the inner component that calls `useSearchParams`). Without this split the build will warn or fail.

### Server Actions for admin mutations
The `/admin/reservations` page uses a Server Action (`updateStatus`) to confirm or cancel reservations. The action calls `revalidatePath('/admin/reservations')` so the table re-renders with fresh data immediately. No separate API route is needed — Server Actions are the right tool for form-driven mutations inside authenticated server-rendered pages.

---

## Folder Structure

```
restaurant-concept/
├── src/
│   ├── app/
│   │   ├── (admin)/                   Route group — admin-related pages.
│   │   │   │                          Parentheses mean this segment does not
│   │   │   │                          appear in the URL.
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx         Auth check + sidebar shell. Server
│   │   │   │   │                      component. Redirects if no session.
│   │   │   │   ├── page.tsx           /admin — dashboard placeholder.
│   │   │   │   └── reservations/
│   │   │   │       └── page.tsx       /admin/reservations — reservations table
│   │   │   │                          with confirm/cancel Server Actions.
│   │   │   └── login/
│   │   │       └── page.tsx           /login — public, client component.
│   │   │
│   │   ├── (site)/                    Route group — public-facing pages.
│   │   │   ├── _components/
│   │   │   │   └── NavBar.tsx         Fixed nav bar, scroll-aware background.
│   │   │   │                          Client component.
│   │   │   ├── layout.tsx             Site shell — dark background + NavBar.
│   │   │   ├── page.tsx               / — homepage: hero, intro, menu preview,
│   │   │   │                          CTA. Server component, fetches appetizers.
│   │   │   ├── about/
│   │   │   │   └── page.tsx           /about — static brand story page.
│   │   │   ├── contact/
│   │   │   │   └── page.tsx           /contact — address, hours, booking CTA.
│   │   │   │                          Static.
│   │   │   ├── menu/
│   │   │   │   └── page.tsx           /menu — full menu grouped by category.
│   │   │   │                          Server component, fetches menu_items.
│   │   │   └── booking/
│   │   │       └── page.tsx           /booking — reservation form. Client
│   │   │                              component. POSTs to /api/reserve.
│   │   │
│   │   ├── api/
│   │   │   └── reserve/
│   │   │       └── route.ts           POST /api/reserve — public booking
│   │   │                              endpoint. Inserts reservation + sends
│   │   │                              confirmation email via Resend.
│   │   │
│   │   ├── globals.css                Tailwind v4 entry point (@import "tailwindcss").
│   │   └── layout.tsx                 Root layout — html/body, Geist font, metadata.
│   │
│   ├── emails/
│   │   └── ConfirmationEmail.tsx      React email template. Plain HTML tables
│   │                                  (no @react-email dependency). Renders
│   │                                  booking details + booking reference.
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts              Browser Supabase client (anon key).
│   │       └── server.ts              Server Supabase client (anon key + cookie helpers).
│   │
│   └── proxy.ts                       Next.js 16 proxy (formerly middleware).
│                                      Guards /admin/* routes.
│
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql             Tables, enums, indexes, triggers.
│       └── 002_rls.sql                Row Level Security policies.
│
├── .env.local                         Secrets — never committed.
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Public Site Pages

All public pages live in the `(site)` route group and share a dark-aesthetic layout (`bg-[#0a0a0a]`) with a fixed `NavBar`.

| Route | File | Type | Notes |
|---|---|---|---|
| `/` | `(site)/page.tsx` | Server | Hero, philosophy intro, appetizer preview (fetched live from DB), CTA |
| `/menu` | `(site)/menu/page.tsx` | Server | Full menu fetched from DB, grouped by category order: appetizer → main → dessert → drink |
| `/about` | `(site)/about/page.tsx` | Static | Brand story, two-column copy, closing quote |
| `/contact` | `(site)/contact/page.tsx` | Static | Address, phone/email, hours, booking CTA link |
| `/booking` | `(site)/booking/page.tsx` | Client | Reservation form — POSTs to `/api/reserve`, shows confirmation with booking reference on success |

The homepage's menu preview section only renders if the DB returns at least one appetizer. If the DB is empty or the query fails, the section is simply absent — no error state shown to guests.

The menu page uses a fixed category display order (`CATEGORY_ORDER = ['appetizer', 'main', 'dessert', 'drink']`) regardless of database sort order.

---

## Email Template

`src/emails/ConfirmationEmail.tsx` is a React component rendered by Resend. It uses plain HTML `<table>` elements with inline styles — not `@react-email`'s component library — for maximum email client compatibility.

**Props:**

| Prop | Type | Notes |
|---|---|---|
| `guestName` | string | |
| `restaurantName` | string | Pulled from `RESTAURANT_NAME` env var at send time |
| `reservationDate` | string | `YYYY-MM-DD` as stored |
| `reservationTime` | string | `HH:MM` or `HH:MM:SS` as stored |
| `partySize` | number | |
| `specialRequests` | `string \| null` | Row only renders if non-null |
| `reservationId` | string | UUID — first 8 chars uppercased as the booking reference |

The booking reference shown in the email (`reservationId.slice(0, 8).toUpperCase()`) matches what the booking confirmation page shows the guest, so they can quote the same reference when contacting the restaurant.

---

## Supabase Client Files

Two files, two contexts. Use the wrong one and auth will silently break.

### `src/lib/supabase/client.ts` — browser client

```ts
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

- Uses `createBrowserClient` from `@supabase/ssr`.
- Reads and writes session cookies via the browser's native cookie API.
- **Use in:** Client Components (`'use client'`), event handlers, and any code that runs in the browser.
- **Do not use in:** Server Components, Route Handlers, or the proxy. Those environments have no browser cookie API.

### `src/lib/supabase/server.ts` — server client

```ts
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

- Uses `createServerClient` from `@supabase/ssr`.
- Reads cookies via `cookies()` from `next/headers` (async in Next.js 15+).
- `setAll` is wrapped in `try/catch` because Server Components cannot set cookies — only Server Actions and Route Handlers can. The catch is a deliberate no-op, not an error being swallowed.
- **Use in:** Server Components, Route Handlers (when you need the user's session, not service-role operations), and Server Actions.
- **Do not use in:** Client Components or the proxy.

### The proxy client — neither of the above

The proxy (`src/proxy.ts`) creates its own inline `createServerClient` using `request.cookies` and `response.cookies` from the `NextRequest`/`NextResponse` objects. It cannot use the `server.ts` helper because `cookies()` from `next/headers` is not available in the proxy context. This is intentional and correct.

### The service role client — route handlers only

`src/app/api/reserve/route.ts` creates a fourth client variant using `createClient` from `@supabase/supabase-js` directly (not `@supabase/ssr`), initialized with `SUPABASE_SERVICE_ROLE_KEY`. This client bypasses RLS entirely. It is only created inside server-side route handler code, never exported, and never touches the browser. See the Security Model section for why.

---

## Security Model

### Key types

| Key | Env var | Exposed to browser | Bypasses RLS |
|---|---|---|---|
| Anon key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | No |
| Service role key | `SUPABASE_SERVICE_ROLE_KEY` | **Never** | **Yes** |

**The anon key is public.** It is prefixed `NEXT_PUBLIC_` because it is intentionally embedded in the client-side JavaScript bundle. It is not a secret. Its power is limited entirely by Row Level Security policies.

**The service role key is a master key.** It bypasses all RLS. It must never appear in any file imported by a Client Component, and it must never be prefixed with `NEXT_PUBLIC_`. It is only used in server-side route handlers to perform operations that require elevated trust (e.g., inserting a reservation on behalf of an anonymous guest where RLS would otherwise block the write path).

### NEXT_PUBLIC_ prefix rules

Next.js includes any environment variable prefixed `NEXT_PUBLIC_` in the client bundle. If a secret is accidentally prefixed this way, it will be visible to anyone who inspects the page source.

- `NEXT_PUBLIC_SUPABASE_URL` — safe, the URL is not a secret.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — safe by design, anon key is public.
- `NEXT_PUBLIC_RESTAURANT_ID` — safe, a UUID that identifies which restaurant to book. Used by the booking form client-side. Not a secret.
- `SUPABASE_SERVICE_ROLE_KEY` — no `NEXT_PUBLIC_` prefix, server only.
- `RESEND_API_KEY` — no `NEXT_PUBLIC_` prefix, server only.

### Row Level Security

RLS policies are defined in `supabase/migrations/002_rls.sql`. The model:

| Table | `anon` | `authenticated` |
|---|---|---|
| `restaurants` | SELECT only | SELECT only |
| `menu_items` | SELECT available items only | Full access |
| `reservations` | INSERT only | SELECT + UPDATE |

Guests can submit reservations (`anon` INSERT) but cannot read or modify them. Staff can read and update all reservations. Nobody can delete reservations through the API — deletions require service role or direct DB access.

**The reservation INSERT in `/api/reserve` uses the service role key**, not the anon key. This is because the RLS `anon` INSERT policy would also allow direct database inserts from anyone who has the anon key, bypassing the API's server-side validation. By routing all inserts through the API with the service role key, validation is the only path to the database.

### Auth in the proxy vs. the layout

The proxy calls `supabase.auth.getUser()`, which validates the session token against the Supabase Auth server on every request. This is the correct call for authorization decisions — `getSession()` only reads the local cookie and does not verify the token. An attacker with a forged cookie would pass `getSession()` but fail `getUser()`.

---

## API Route Design

### `POST /api/reserve`

Located at `src/app/api/reserve/route.ts`. Public endpoint — no auth required, guests use it to submit reservations.

**Request body (JSON):**

| Field | Type | Required | Notes |
|---|---|---|---|
| `guestName` | string | Yes | Trimmed before storage |
| `guestEmail` | string | Yes | Validated against email regex; lowercased before storage |
| `guestPhone` | string | No | Optional — stored as `null` if absent or blank |
| `restaurantId` | string (UUID) | Yes | Foreign key into `restaurants` |
| `reservationDate` | string | Yes | `YYYY-MM-DD` |
| `reservationTime` | string | Yes | `HH:MM` or `HH:MM:SS` |
| `partySize` | number | Yes | Positive integer |
| `specialRequests` | string | No | Stored as `null` if absent or blank |

`guestPhone` is optional. The booking form omits it from the request body entirely if the field is blank. The API accepts its absence without error.

**Validation order:**
1. JSON parse — returns `400` if body is not valid JSON.
2. Bulk missing-field check — returns all missing required field names in one response so the caller can fix everything at once.
3. Per-field format validation — email regex, date regex + `Date.parse`, time regex, integer check.
4. Database insert via service role client.
5. Confirmation email via Resend.
6. If email succeeds: `UPDATE reservation SET confirmation_sent_at = now()`.

**Responses:**
- `201` — `{ id: string }` — reservation created (email may or may not have sent).
- `400` — `{ error: string, fields?: string[] }` — client error.
- `500` — `{ error: string }` — database failure.

A failed email send is logged but does not change the response — the guest still gets `201`. `confirmation_sent_at` stays `NULL` if the email failed, enabling recovery (see below).

### The `confirmation_sent_at` failure recovery pattern

The API performs these operations after validation:

```
1. INSERT reservation (confirmation_sent_at not set)
2. await resend.emails.send(...)
3. If step 2 succeeded: UPDATE reservation SET confirmation_sent_at = now()
```

The update in step 3 only happens when the email actually sent. If the email fails, `confirmation_sent_at` stays `NULL`. A recovery job can find all unconfirmed reservations with:

```sql
SELECT * FROM reservations
WHERE confirmation_sent_at IS NULL
  AND created_at > now() - interval '1 hour';
```

A partial index exists for this query: `idx_reservations_unconfirmed` on `(restaurant_id, created_at) WHERE confirmation_sent_at IS NULL`. When a row is confirmed, it falls out of the index automatically.

The `updateError` from step 3 is logged but treated as non-fatal — the reservation was created and the email was sent. A failed timestamp write should not 500 the guest.

---

## Auth Flow

End-to-end walkthrough of an unauthenticated user trying to reach `/admin/reservations`:

1. **Browser** — GET `/admin/reservations`
2. **Proxy** (`src/proxy.ts`) — matcher fires on `/admin/:path*`. `getUser()` returns `null` (no session cookie). Proxy redirects to `/login?next=/admin/reservations`.
3. **Login page** (`src/app/(admin)/login/page.tsx`) — renders the sign-in form. `useSearchParams` reads `next=/admin/reservations` and stores it for use after submit.
4. **User submits credentials** — `supabase.auth.signInWithPassword()` is called on the browser client. On success, Supabase writes encrypted session cookies to the browser.
5. **`router.replace('/admin/reservations')`** — client-side navigation. The login page is removed from history.
6. **Next.js renders `/admin/reservations`** — the admin layout (`src/app/(admin)/admin/layout.tsx`) runs. `getUser()` now returns a user because the session cookies are present. Layout renders the sidebar and the page content.

If step 4 fails (wrong password, unknown user), `error.message` from the Supabase SDK is displayed inline below the form via `role="alert"`. The loading state is cleared. No redirect occurs.

---

## Environment Variables

```bash
# Supabase — project URL and keys
NEXT_PUBLIC_SUPABASE_URL=         # Public, goes in client bundle
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public, goes in client bundle, limited by RLS
SUPABASE_SERVICE_ROLE_KEY=        # SECRET — server only, bypasses RLS

# Resend — transactional email
RESEND_API_KEY=                   # SECRET — server only
RESEND_FROM_EMAIL=                # The from address for outgoing email (e.g. reservations@yourdomain.com)

# Restaurant config
NEXT_PUBLIC_RESTAURANT_ID=        # UUID of the restaurant row in the restaurants table.
                                  # Used by the booking form client-side to populate restaurantId.
                                  # Not a secret.
RESTAURANT_NAME=                  # Display name used in confirmation emails, e.g. "The Grand Table"
RESTAURANT_SLUG=                  # URL slug, e.g. "the-grand-table" (reserved for future use)
RESTAURANT_EMAIL=                 # Contact email shown to guests (reserved for future use)
RESTAURANT_TIMEZONE=              # IANA timezone, e.g. "America/New_York" (reserved for future use)

# App
NEXT_PUBLIC_APP_URL=              # Base URL, used for absolute links in emails
```

`NEXT_PUBLIC_RESTAURANT_ID` must be a valid UUID that exists in the `restaurants` table. The booking form sends it as `restaurantId` in the POST body, and the API validates it against the DB before inserting.

---

## What Is Not Built Yet

- Sign-out — no sign-out button in the admin sidebar yet.
- Menu management — `menu_items` table exists and the public menu page reads from it, but there is no admin UI to create or edit items.
- `restaurants` table seed — `NEXT_PUBLIC_RESTAURANT_ID` must match a row in `restaurants`. No seed script exists; the row must be inserted manually via the Supabase dashboard or SQL editor.
- Admin dashboard (`/admin`) — the page exists but shows only a placeholder. No summary stats or quick actions yet.
