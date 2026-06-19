
ALTER TABLE public.rides
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT encode(gen_random_bytes(16),'hex'),
  ADD COLUMN IF NOT EXISTS distance_km numeric,
  ADD COLUMN IF NOT EXISTS duration_min numeric,
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vehicle text,
  ADD COLUMN IF NOT EXISTS plate text,
  ADD COLUMN IF NOT EXISTS rating numeric NOT NULL DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS total_trips integer NOT NULL DEFAULT 0;

DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.sos_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES public.rides(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  note text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.sos_incidents TO authenticated;
GRANT ALL ON public.sos_incidents TO service_role;
ALTER TABLE public.sos_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sos_self_insert ON public.sos_incidents;
DROP POLICY IF EXISTS sos_self_read ON public.sos_incidents;
DROP POLICY IF EXISTS sos_admin_update ON public.sos_incidents;
CREATE POLICY sos_self_insert ON public.sos_incidents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY sos_self_read ON public.sos_incidents
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY sos_admin_update ON public.sos_incidents
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE VIEW public.public_trip_view
WITH (security_invoker=on) AS
SELECT
  r.id, r.share_token, r.status,
  r.pickup, r.drop_loc,
  r.pickup_lat, r.pickup_lng, r.drop_lat, r.drop_lng,
  r.driver_id,
  dl.lat AS driver_lat, dl.lng AS driver_lng, dl.heading AS driver_heading,
  p.name AS driver_name, p.vehicle, p.plate, p.rating
FROM public.rides r
LEFT JOIN public.driver_locations dl ON dl.driver_id = r.driver_id
LEFT JOIN public.profiles p ON p.id = r.driver_id;

GRANT SELECT ON public.public_trip_view TO anon, authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_incidents;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP POLICY IF EXISTS rides_drivers_browse ON public.rides;
CREATE POLICY rides_drivers_browse ON public.rides
  FOR SELECT TO authenticated
  USING (status = 'searching' AND public.has_role(auth.uid(), 'driver'));
