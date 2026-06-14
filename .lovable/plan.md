# Phase 2 — DriverLink Pro Backend & Real Integrations

Defaults I'm picking (you skipped both questions):
- **Backend:** Enable Lovable Cloud (required for real auth + server-side Gemini + Realtime; no card, no external accounts).
- **OTP delivery:** Email OTP (free, instant). Phone number stays as a profile field; SMS OTP can be swapped in later by adding Twilio.

## 1. Enable Lovable Cloud
Provisions Postgres, Auth, Realtime, server fns, and `LOVABLE_API_KEY` for the AI Gateway.

## 2. Database schema (migration)
- `profiles` (id → auth.users, name, phone, photo, created_at) + auto-create trigger on signup.
- `user_roles` (separate table, enum `app_role` = owner | driver) + `has_role()` security-definer fn. Role chosen on `/role` writes a row here.
- `rides` (id, owner_id, driver_id, pickup, drop, car_type, fare_estimate, status, created_at, started_at, completed_at).
- `driver_locations` (driver_id PK, lat, lng, heading, online, updated_at) — broadcast via Realtime.
- RLS + GRANTs on all tables, scoped per role.

## 3. Real auth (Email OTP + Google)
- `/login` → `supabase.auth.signInWithOtp({ email })` → `/otp` enters 6-digit code → `verifyOtp`.
- Google button → `signInWithOAuth({ provider: 'google' })`.
- `_authenticated` layout gate using integration-managed pattern; redirects unauthenticated users to `/login`.
- `/role` writes selected role to `user_roles`; subsequent visits route owners → `/home`, drivers → `/driver-home`.
- Profile, logout, session listener in root.

## 4. Gemini fare prediction (real)
- Server fn `predictFare` in `src/lib/fare.functions.ts` using AI SDK + Lovable Gateway helper (`google/gemini-3-flash-preview`), structured `Output.object` schema → `{ base, distance, surge, total, confidence, reasoning }`.
- `/book` calls it via `useServerFn` + `useMutation`; surfaces 429/402 as toast.

## 5. Leaflet map + live driver tracking
- Add `leaflet` + `react-leaflet`; dark CartoDB tiles to match theme.
- `/tracking` replaces the faux SVG map with a real Leaflet map showing pickup, drop, driver marker, and animated polyline.
- Driver side (`/driver-home` when online): `navigator.geolocation.watchPosition` → server fn upserts `driver_locations` and broadcasts on a Realtime channel `ride:{rideId}`.
- Owner side: subscribes to that channel, animates marker between updates, recomputes ETA. Falls back to mock simulation if no driver is publishing (so the demo still works).

## 6. Skeletons, error states, offline handling
- `Skeleton` variants for home/bookings/wallet/notifications/tracking cards (using existing shadcn `skeleton`).
- Per-route `errorComponent` with retry → `router.invalidate()`; empty states for bookings/notifications/wallet.
- Global offline banner via `navigator.onLine` + `online`/`offline` listeners in `AppShell`; queued ride actions show "Reconnecting…" toast.
- Toast on auth/fare/tracking failures using existing `sonner`.

## 7. Quiet fixes
- Hydration mismatch on `StatusBar` clock (server "05:47" vs client "11:18") — render time only after mount.

## Technical notes
- All AI + DB writes go through `createServerFn` with `requireSupabaseAuth`; `attachSupabaseAuth` already wired in `src/start.ts` (verify).
- Realtime channel pattern: `supabase.channel('ride:'+rideId).on('broadcast', { event: 'loc' }, …)`.
- Leaflet CSS imported in `styles.css`; map container lazy-mounted (no SSR — Leaflet touches `window`).
- Mock data kept as fallback so screens still render before any rides exist.

## Out of scope (later phase)
ML trust score, subscription payments, SMS OTP, driver KYC uploads, scheduled rides.

Approve to start with step 1 (enable Cloud + migration).