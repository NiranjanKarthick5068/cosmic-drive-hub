
-- 1. driver_locations: restrict SELECT
DROP POLICY IF EXISTS drv_loc_read_all ON public.driver_locations;

CREATE POLICY drv_loc_self_read ON public.driver_locations
  FOR SELECT TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY drv_loc_active_ride_read ON public.driver_locations
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.rides r
    WHERE r.driver_id = driver_locations.driver_id
      AND r.owner_id = auth.uid()
      AND r.status IN ('accepted','arriving','started')
  ));

-- 2. profiles: allow counterparty read on active ride
CREATE POLICY profiles_ride_counterparty_read ON public.profiles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.rides r
    WHERE r.status IN ('accepted','arriving','started','completed')
      AND (
        (r.owner_id = auth.uid() AND r.driver_id = profiles.id)
        OR
        (r.driver_id = auth.uid() AND r.owner_id = profiles.id)
      )
  ));

-- 3. user_roles: block self-insert; provide safe SECURITY DEFINER function
DROP POLICY IF EXISTS user_roles_self_insert ON public.user_roles;

CREATE OR REPLACE FUNCTION public.assign_self_role(_role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _role NOT IN ('owner','driver') THEN
    RAISE EXCEPTION 'Role not self-assignable';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_self_role(public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.assign_self_role(public.app_role) TO authenticated;
