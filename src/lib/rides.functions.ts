import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CreateRide = z.object({
  pickup: z.string().min(1).max(200),
  drop: z.string().min(1).max(200),
  carType: z.string().max(40),
  fareEstimate: z.number().int().min(0).max(20000),
  reasoning: z.string().max(500).optional(),
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
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { rideId: row.id as string };
  });

const RoleInput = z.object({ role: z.enum(["owner", "driver"]) });
export const setRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RoleInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_roles")
      .insert({ user_id: context.userId, role: data.role });
    if (error && !error.message.includes("duplicate"))
      throw new Error(error.message);
    return { ok: true };
  });

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
