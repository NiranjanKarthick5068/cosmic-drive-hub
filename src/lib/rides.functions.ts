import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ----------------------------- create ride ----------------------------- */

const CreateRide = z.object({
  pickup: z.string().min(1).max(200),
  drop: z.string().min(1).max(200),
  carType: z.string().max(40),
  fareEstimate: z.number().int().min(0).max(20000),
  reasoning: z.string().max(500).optional(),
  pickupLat: z.number().min(-90).max(90).optional(),
  pickupLng: z.number().min(-180).max(180).optional(),
  dropLat: z.number().min(-90).max(90).optional(),
  dropLng: z.number().min(-180).max(180).optional(),
  distanceKm: z.number().min(0).max(2000).optional(),
  durationMin: z.number().min(0).max(2000).optional(),
});

export const createRide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateRide.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("rides")
      .insert({
        owner_id: context.userId,
        pickup: data.pickup,
        drop_loc: data.drop,
        car_type: data.carType,
        fare_estimate: data.fareEstimate,
        ai_reasoning: data.reasoning ?? null,
        status: "searching",
        pickup_lat: data.pickupLat ?? null,
        pickup_lng: data.pickupLng ?? null,
        drop_lat: data.dropLat ?? null,
        drop_lng: data.dropLng ?? null,
        distance_km: data.distanceKm ?? null,
        duration_min: data.durationMin ?? null,
      })
      .select("id, share_token")
      .single();
    if (error) throw new Error(error.message);
    return { rideId: row.id as string, shareToken: row.share_token as string };
  });

/* ------------------------------- roles -------------------------------- */

const RoleInput = z.object({ role: z.enum(["owner", "driver"]) });
export const setRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RoleInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_roles")
      .insert({ user_id: context.userId, role: data.role });
    if (error && !error.message.toLowerCase().includes("duplicate"))
      throw new Error(error.message);
    return { ok: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r) => r.role as string) };
  });

/* -------------------------- driver location --------------------------- */

const LocInput = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().nullable().optional(),
  online: z.boolean(),
});
export const upsertDriverLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => LocInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("driver_locations").upsert({
      driver_id: context.userId,
      lat: data.lat,
      lng: data.lng,
      heading: data.heading ?? null,
      online: data.online,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const goOffline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("driver_locations")
      .update({ online: false, updated_at: new Date().toISOString() })
      .eq("driver_id", context.userId);
    return { ok: true };
  });

/* ----------------------------- ride reads ----------------------------- */

export const listMyRides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("rides")
      .select("*")
      .or(`owner_id.eq.${context.userId},driver_id.eq.${context.userId}`)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { rides: data ?? [] };
  });

const RideIdInput = z.object({ rideId: z.string().uuid() });

export const getRide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => RideIdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: ride, error } = await context.supabase
      .from("rides")
      .select("*")
      .eq("id", data.rideId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ride) return { ride: null, driver: null };
    let driver: {
      id: string;
      name: string | null;
      vehicle: string | null;
      plate: string | null;
      rating: number;
      total_trips: number;
      photo: string | null;
    } | null = null;
    if (ride.driver_id) {
      const { data: p } = await context.supabase
        .from("profiles")
        .select("id, name, vehicle, plate, rating, total_trips, photo")
        .eq("id", ride.driver_id)
        .maybeSingle();
      driver = p ?? null;
    }
    return { ride, driver };
  });

/* --------------------------- driver matching --------------------------- */

export const listOpenRides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("rides")
      .select("*")
      .eq("status", "searching")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return { rides: data ?? [] };
  });

export const acceptRide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => RideIdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("rides")
      .update({
        driver_id: context.userId,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", data.rideId)
      .eq("status", "searching")
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Ride already taken");
    return { ok: true };
  });

const StatusInput = z.object({
  rideId: z.string().uuid(),
  status: z.enum(["arriving", "started", "completed"]),
});
export const updateRideStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => StatusInput.parse(i))
  .handler(async ({ data, context }) => {
    const now = new Date().toISOString();
    const { error } = await context.supabase
      .from("rides")
      .update({
        status: data.status,
        started_at: data.status === "started" ? now : undefined,
        completed_at: data.status === "completed" ? now : undefined,
      })
      .eq("id", data.rideId)
      .eq("driver_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const CancelInput = z.object({
  rideId: z.string().uuid(),
  reason: z.string().max(200).optional(),
});
export const cancelRide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CancelInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("rides")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: data.reason ?? null,
      })
      .eq("id", data.rideId)
      .or(`owner_id.eq.${context.userId},driver_id.eq.${context.userId}`);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------- driver earnings -------------------------- */

export const getDriverEarnings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const { data, error } = await context.supabase
      .from("rides")
      .select("fare_estimate, fare_final, completed_at, status")
      .eq("driver_id", context.userId)
      .eq("status", "completed")
      .gte("completed_at", weekStart.toISOString());
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    let today = 0;
    let week = 0;
    let trips = 0;
    for (const r of rows) {
      const amt = r.fare_final ?? r.fare_estimate ?? 0;
      week += amt;
      trips += 1;
      if (r.completed_at && new Date(r.completed_at) >= since) today += amt;
    }
    return { today, week, trips };
  });

/* -------------------------------- SOS --------------------------------- */

const SosInput = z.object({
  rideId: z.string().uuid().optional(),
  lat: z.number(),
  lng: z.number(),
  note: z.string().max(200).optional(),
});
export const triggerSos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SosInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("sos_incidents").insert({
      user_id: context.userId,
      ride_id: data.rideId ?? null,
      lat: data.lat,
      lng: data.lng,
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------- admin -------------------------------- */

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const [drivers, online, active, today] = await Promise.all([
      context.supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "driver"),
      context.supabase.from("driver_locations").select("driver_id", { count: "exact", head: true }).eq("online", true),
      context.supabase.from("rides").select("id", { count: "exact", head: true }).in("status", ["searching", "accepted", "arriving", "started"]),
      context.supabase
        .from("rides")
        .select("fare_final, fare_estimate, completed_at")
        .eq("status", "completed")
        .gte("completed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);
    const revenue = (today.data ?? []).reduce(
      (s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0),
      0,
    );
    return {
      drivers: drivers.count ?? 0,
      online: online.count ?? 0,
      active: active.count ?? 0,
      revenueToday: revenue,
    };
  });
