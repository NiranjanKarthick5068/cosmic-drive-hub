import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export type ProfileRow = {
  id: string;
  name: string | null;
  phone: string | null;
  photo: string | null;
  vehicle: string | null;
  plate: string | null;
  rating: number;
  total_trips: number;
};

export function useProfile() {
  const { user, loading } = useSession();
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancel = false;
    supabase
      .from("profiles")
      .select("id, name, phone, photo, vehicle, plate, rating, total_trips")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancel) setProfile(data ?? null);
      });
    return () => {
      cancel = true;
    };
  }, [user?.id]);

  return { profile, user, loading };
}
