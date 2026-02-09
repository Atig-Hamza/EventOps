"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ── Floating ring ── */
function Ring({
  size,
  duration,
  delay,
  opacity,
}: {
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full border border-white"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        borderColor: `rgba(255, 255, 255, ${opacity})`,
      }}
      initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
      animate={{ rotate: -360, scale: 1, opacity: 1 }}
      transition={{
        rotate: { duration, ease: "linear", repeat: Infinity, delay },
        scale: { duration: 1.2, ease: [0.2, 0.6, 0.35, 1], delay: delay * 0.5 },
        opacity: { duration: 1.2, ease: "easeOut", delay: delay * 0.5 },
      }}
    />
  );
}

export default function SignupPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", { email, password, role });
      login(res.data.token, {
        id: res.data.id,
        email: res.data.email,
        role: res.data.role,
      });
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Minimal rings animation ── */}
      <div className="hidden lg:flex lg:w-[50%] bg-neutral-900 relative overflow-hidden items-center justify-center">
        {/* Soft ambient glow */}
        <motion.div
          className="absolute w-125 h-125 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(88, 86, 214, 0.07) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            marginTop: -250,
            marginLeft: -250,
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Rings (reverse rotation for variety) */}
        <Ring size={120} duration={30} delay={0} opacity={0.07} />
        <Ring size={220} duration={40} delay={0.2} opacity={0.05} />
        <Ring size={340} duration={55} delay={0.4} opacity={0.03} />
        <Ring size={460} duration={70} delay={0.6} opacity={0.02} />

        {/* Center dot cluster */}
        <motion.div
          className="relative z-10 flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.6, 0.35, 1] }}
        >
          {[6, 10, 6].map((s, i) => (
            <motion.div
              key={i}
              className="rounded-full bg-white"
              style={{ width: s, height: s, opacity: i === 1 ? 0.25 : 0.1 }}
              animate={{ opacity: i === 1 ? [0.25, 0.4, 0.25] : [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>

        {/* Bottom text */}
        <motion.div
          className="absolute bottom-12 left-12 right-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.2, 0.6, 0.35, 1] }}
        >
          <h2 className="text-[26px] font-semibold text-white tracking-tight leading-[1.2] mb-2">
            Get started.
          </h2>
          <p className="text-white/35 text-[15px] leading-relaxed">
            Create your account and start managing events in minutes.
          </p>
        </motion.div>
      </div>

      {/* ── Right Panel — Signup Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[--background]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.2, 0.6, 0.35, 1] }}
          className="w-full max-w-100"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 mb-4">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">EventOps</h1>
          </div>

          <div className="mb-9">
            <h1 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-1.5">
              Create account
            </h1>
            <p className="text-neutral-500 text-[15px]">
              Fill in your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              minLength={6}
            />

            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-neutral-700">
                Account type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "PARTICIPANT", label: "Participant", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
                  { value: "ADMIN", label: "Admin", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`group flex flex-col items-center gap-2 px-4 py-4 rounded-xl text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                      role === opt.value
                        ? "bg-neutral-900 text-white shadow-md"
                        : "bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
                      {opt.value === "ADMIN" && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium rounded-xl"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Create account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[12px] text-neutral-400 font-medium select-none">OR</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <p className="mt-6 text-center text-[14px] text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-900 font-semibold hover:underline underline-offset-4 decoration-neutral-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
