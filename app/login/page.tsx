"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { isValidEmail } from "@/lib/utils";
import { setAdminSession } from "@/lib/credentials";
import { supabase } from "@/lib/supabase";
import { syncSupabaseMember, signOutMember } from "@/lib/memberAuth";
import { adminConfig } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password || password.length < 4) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (email.toLowerCase() === adminConfig.email.toLowerCase() && password === adminConfig.password) {
      setAdminSession();
      showToast("Welcome back, Admin!", "success");
      router.push("/admin");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setSubmitting(false);
      const notConfirmed = error?.message.toLowerCase().includes("email not confirmed");
      setErrors({
        password: notConfirmed
          ? "Please verify your email first — check your inbox for the confirmation link."
          : "Incorrect email or password.",
      });
      return;
    }

    const member = await syncSupabaseMember(data.user.id);
    setSubmitting(false);
    if (!member) {
      await signOutMember();
      setErrors({ password: "No member profile found for this account." });
      return;
    }
    showToast(`Welcome back, ${member.fullName}!`, "success");
    router.push(member.role === "leader" ? "/admin" : "/membership");
  };

  const inputClass =
    "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm text-charcoal focus-ring";

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] items-center bg-cream motif-dots">
      <Container className="w-full">
        <div className="mx-auto max-w-sm">
          <div className="text-center mb-8">
            <img
              src="/logo.webp"
              alt="Bandhan Cultural Association"
              className="mx-auto h-14 w-14 rounded-full object-cover shadow-card"
            />
            <h1 className="mt-4 font-display text-2xl font-semibold text-maroon-500">
              Member Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl bg-white/70 border border-maroon-500/10 p-6 shadow-card">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">
                Email id
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-maroon-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-maroon-600">{errors.password}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" size="lg" className="flex-1 justify-center" disabled={submitting}>
                {submitting ? "Signing in…" : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 justify-center"
                onClick={() => router.push("/register")}
              >
                Registration
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
