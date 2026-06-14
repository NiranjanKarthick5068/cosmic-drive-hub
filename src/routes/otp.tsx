import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/otp")({ component: OTP });

function OTP() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setEmail(sessionStorage.getItem("dl_otp_email") ?? "");
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const verify = async (code: string) => {
    if (!email) return toast.error("Email missing, go back");
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setVerifying(false);
    if (error) {
      toast.error(error.message);
      setDigits(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
      return;
    }
    nav({ to: "/role" });
  };

  const setAt = (i: number, v: string) => {
    const n = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = n;
    setDigits(next);
    if (n && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d)) verify(next.join(""));
  };

  const resend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return toast.error(error.message);
    toast.success("Code resent");
    setTimer(30);
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
        <button
          onClick={() => nav({ to: "/login" })}
          className="w-10 h-10 rounded-full bg-surface ring-1 ring-border flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="font-display font-bold text-3xl">Verify email</h1>
        <p className="text-text-secondary mt-2 mb-10">
          Code sent to{" "}
          <span className="text-text-primary font-mono break-all">
            {email || "your inbox"}
          </span>
        </p>

        <div className="flex gap-3 justify-between mb-8">
          {digits.map((d, i) => (
            <motion.input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              animate={{
                borderColor: d ? "oklch(0.65 0.25 295)" : "oklch(0.22 0.04 282)",
                scale: d ? 1.04 : 1,
              }}
              className="w-12 h-14 rounded-2xl bg-surface text-center text-2xl font-mono font-semibold border-2 outline-none"
            />
          ))}
        </div>

        <div className="text-center text-sm text-text-secondary mb-8">
          {timer > 0 ? (
            <>Resend in <span className="font-mono text-text-primary">{timer}s</span></>
          ) : (
            <button onClick={resend} className="text-violet-light font-semibold">
              Resend code
            </button>
          )}
        </div>

        <RippleButton
          size="lg"
          block
          disabled={!digits.every((d) => d) || verifying}
          onClick={() => verify(digits.join(""))}
          className="mt-auto"
        >
          {verifying ? "Verifying…" : "Verify"}
        </RippleButton>
      </div>
    </PhoneFrame>
  );
}
