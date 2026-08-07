# Dental Platform

Premium dental clinic platform. V1 = high-end frontend demo (no backend).
Goal: impress the client and close the contract. Backend (Supabase) comes later,
so the architecture must make backend integration painless — not a rewrite.

## Tech stack
- Next.js 16 (App Router) — `create-next-app@latest`; App Router API identical to 15
- TypeScript (strict)
- Tailwind CSS v4 — CSS-first. Tokens live in `src/app/globals.css` (`@theme`), NOT a JS config
- shadcn/ui — "base-nova" style, built on Base UI primitives (`@base-ui/react`, the Radix successor)
- Framer Motion (animations)
- Lucide (icons)
- Supabase (Postgres + Auth + RLS) — booking backend, added in V2. Client via
  `@supabase/ssr`: `src/lib/supabase/client.ts` (browser) + `server.ts` (server).
  DB types are generated into `src/lib/supabase/database.types.ts`; DB-aligned
  aliases live in `src/types/db.ts`. Migrations under `supabase/migrations`.

## Design language
- Premium, minimal, medical, trustworthy. Think Apple / Linear / Stripe / Notion.
- Primary: #2563EB. Background: pure white. Secondary: very light gray.
  Text: almost black. Accent: soft blue.
- Generous white space, rounded corners, soft shadows, subtle micro-animations.
- No strong gradients, no flashy effects, no visual clutter.
- Mobile-first for the public site. Desktop-first for the admin dashboard.
- Accessible: WCAG AA contrast, keyboard navigation, focus states, alt text.

## Architecture rules
- Every UI element is a reusable component. NEVER duplicate UI.
- All mock data is typed with the shared types in `src/types`.
- All colors, spacing, radii come from Tailwind theme tokens — no hardcoded hex in components.
- Components stay presentational; data comes in via props.
- Buttons/forms are UI-only in V1 (no submit logic), but built as if they will be wired later.

## Naming & structure
- Files: kebab-case. Components: PascalCase. Types: PascalCase. Variables/functions/props: camelCase.
- Data-model FIELDS are snake_case, mirroring the future Supabase columns 1:1
  (`created_at`, `image_url`, `service_id`). This is deliberate: when the backend
  lands, a `supabase-js` row drops into a component unchanged — no mapping layer,
  components never touch. Only data fields are snake_case; everything else is camelCase.
- Design tokens: colors/spacing/radii/shadows/typography come from `globals.css`
  `@theme` tokens (Tailwind v4). Use utilities like `bg-primary`, `shadow-soft`,
  `text-display` — never hardcode hex or px in components.

## Backend (V2)
- The public site NEVER touches tables directly. Booking goes through two
  SECURITY DEFINER RPCs only: `get_available_slots` and `create_booking`.
- Anon may read the published catalog (active doctors, published services) and
  call the two RPCs; it CANNOT read the `appointments` table (patient PII).
- The admin dashboard stores real patient PII, so it MUST be behind Supabase
  Auth — every dashboard route is protected. No public sign-up; the dentist
  account is created manually.
- Auto-confirm is controlled by `clinic_settings.booking_requires_approval`
  (a flag, switchable later — no code change to flip confirmed ↔ pending).

## Do NOT
- Never expose the service_role/secret key to the browser or commit it. Only the
  public anon/publishable key + URL belong in `NEXT_PUBLIC_*` env vars.
- Never read/write patient data from anon/client code outside the two RPCs.
