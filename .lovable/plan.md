# DriverLink Pro — Production Plan

This is a 4–6 turn build. I'll ship it in phases so each is reviewable and your credits aren't blown on a single mega-edit. After you approve, I start Phase 1 immediately.

## Decisions I'm making for you (override any in your reply)

- **Maps:** Keep **Leaflet + free OSRM** for routing/ETA. Google Maps requires a billing-enabled key you'd have to add; OSRM is free, no key, and looks ~identical. If you want Google Maps, say so — I'll wire the connector instead.
- **Admin:** Add an `admin` role. After Phase 3 I'll give you the SQL to grant yourself admin.
- **Backend:** Lovable Cloud (already enabled). No Firebase.
- **AI matching/ETA/fare:** Gemini via Lovable AI Gateway (already wired).

## Phase 1 — Schema + remove all mocks
- Migration: add `pickup_lat/lng`, `drop_lat/lng` on `rides`; add `vehicle`, `plate`, `rating` on `profiles`; add `app_role` value `admin`; add `sos_incidents` table; add `share_tokens` for trip-share links; enable Realtime on `rides`, `driver_locations`, `sos_incidents`.
- Delete `src/lib/mock.ts`. Purge every import — bookings, notifications, wallet, driver-found, incoming-ride, ride-complete, tracking, profile screens become DB-driven or show empty states.
- Skeleton + empty-state components everywhere.

## Phase 2 — Real ride lifecycle
- Server fns: `createRide`, `acceptRide`, `updateRideStatus(arriving|started|completed)`, `cancelRide`.
- Status flow: `searching → accepted → arriving → started → completed | cancelled`.
- `/book` geocodes pickup/drop via OSRM Nominatim (free), calls Gemini for fare, inserts ride.
- `/searching` subscribes to its ride row; on `accepted` → `/driver-found` → `/tracking`.
- Driver: `/driver-home` subscribes to `rides` where status=`searching` near them; incoming-ride modal with accept/reject; on accept transitions through statuses.

## Phase 3 — Live tracking + routing
- OSRM route + ETA on `/tracking`; recompute every 15s or on driver move >50m.
- Driver GPS broadcast every 3s (already wired, will tune).
- Smooth marker tween (requestAnimationFrame between updates).
- ETA countdown derived from OSRM duration, not fake timer.

## Phase 4 — Safety + Admin + AI matching
- SOS button → inserts `sos_incidents` row + share token; passenger contact gets a public `/trip/:token` page with live map (no auth, read-only via narrow anon policy on a `public_trip_view`).
- AI matching server fn: pulls online drivers within radius (haversine), ranks by distance + rating via Gemini, returns top 3; ride broadcast targets them in order.
- `/admin` route (admin-only): counts (online drivers, active rides, revenue today), live map of all online drivers via Realtime, recent rides table.

## Out of scope (ask if you want them)
- Payments / payouts (no Stripe).
- SMS / push notifications (no Twilio).
- Driver KYC document upload.
- Multi-stop rides, scheduled rides.
- Mobile-app packaging (stays web).

## Technical notes

```text
DB additions
├── rides: pickup_lat, pickup_lng, drop_lat, drop_lng, share_token, distance_km, duration_min
├── profiles: vehicle, plate, rating, total_trips
├── app_role enum: + 'admin'
├── sos_incidents: ride_id, user_id, lat, lng, created_at
└── public_trip_view: SELECT id, status, driver lat/lng, pickup, drop WHERE share_token = ?

Realtime channels
├── rides (postgres_changes filtered by owner_id / driver_id)
├── driver_locations (broadcast for online drivers)
└── sos_incidents (admin channel)

Free services used
├── OSRM router.project-osrm.org — routing + distance + duration
├── Nominatim openstreetmap.org — geocoding (rate-limited, fine for dev)
└── CartoDB dark tiles — already used
```

Reply **"go"** to start Phase 1, or tell me which phase/decision to change.