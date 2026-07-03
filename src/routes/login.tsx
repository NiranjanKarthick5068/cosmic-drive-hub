import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DriverLink Pro" },
      { name: "description", content: "Sign in to DriverLink Pro to book verified on-demand drivers." },
      { property: "og:title", content: "Sign in — DriverLink Pro" },
      { property: "og:description", content: "Sign in to DriverLink Pro to book verified on-demand drivers." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/login" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/login" }],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const sendOtp = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    sessionStorage.setItem("dl_otp_email", email);
    toast.success("Check your inbox for the code");
    nav({ to: "/otp" });
  };

  const google = async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/role",
    });
    if (r.error) {
      setLoading(false);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col px-6 pt-8 pb-8"
      >
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="font-display font-bold text-4xl leading-tight">
            Welcome <br />
            <span className="text-gradient-violet">back</span>
          </h1>
          <p className="text-text-secondary mt-3">Sign in to book your driver.</p>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-4">
          <label className="text-xs uppercase tracking-wider text-text-secondary">
            Email
          </label>
          <div className="mt-2 flex items-center gap-3 h-14 px-4 rounded-2xl bg-surface ring-1 ring-border focus-within:ring-violet/60 transition">
            <Mail className="w-4 h-4 text-text-secondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent outline-none text-base placeholder:text-text-secondary/60"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <RippleButton
            size="lg"
            block
            disabled={!email || loading}
            onClick={sendOtp}
          >
            <Mail className="w-4 h-4" /> {loading ? "Sending…" : "Send code"}
          </RippleButton>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 my-6 text-text-secondary text-xs"
        >
          <div className="flex-1 h-px bg-border" />
          OR
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <RippleButton variant="outline" size="lg" block onClick={google} disabled={loading}>
            <GoogleIcon /> Continue with Google
          </RippleButton>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-auto text-center text-xs text-text-secondary leading-relaxed"
        >
          By continuing, you agree to our{" "}
          <Link to="/" className="text-violet-light">Terms</Link> &{" "}
          <Link to="/" className="text-violet-light">Privacy</Link>
        </motion.p>
      </motion.div>
    </PhoneFrame>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.2-.1-2.3-.1-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.2 0-9.5-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2c-.4.4 6.8-4.9 6.8-15.2 0-1.2-.1-2.3-.1-3.5z" />
    </svg>
  );
}
