"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function OrbitalRing({
  size,
  duration,
  delay,
  opacity,
  dotCount = 0,
}: {
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  dotCount?: number;
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
      animate={{ rotate: 360, scale: 1, opacity: 1 }}
      transition={{
        rotate: { duration, ease: "linear", repeat: Infinity, delay },
        scale: { duration: 1.2, ease: [0.2, 0.6, 0.35, 1], delay: delay * 0.5 },
        opacity: { duration: 1.2, ease: "easeOut", delay: delay * 0.5 },
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (360 / dotCount) * i;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white"
            style={{
              top: "50%",
              left: "50%",
              opacity: 0.3 + (i % 3) * 0.15,
              transform: `rotate(${angle}deg) translateX(${size / 2}px) translate(-50%, -50%)`,
            }}
            animate={{ opacity: [0.15 + (i % 3) * 0.1, 0.5, 0.15 + (i % 3) * 0.1] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: i * 0.4 }}
          />
        );
      })}
    </motion.div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
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

      <div className="hidden lg:flex lg:w-[50%] bg-neutral-900 relative overflow-hidden items-center justify-center">

        <motion.div
          className="absolute w-150 h-150 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 113, 227, 0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            marginTop: -300,
            marginLeft: -300,
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        />


        <OrbitalRing size={140} duration={25} delay={0} opacity={0.08} dotCount={3} />
        <OrbitalRing size={260} duration={35} delay={0.3} opacity={0.05} dotCount={4} />
        <OrbitalRing size={400} duration={50} delay={0.6} opacity={0.03} dotCount={5} />


        <motion.div
          className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/8 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.6, 0.35, 1] }}
        >
          <span className="text-[22px] font-bold text-white/80">E</span>
        </motion.div>


        <motion.div
          className="absolute bottom-12 left-12 right-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.2, 0.6, 0.35, 1] }}
        >
          <h2 className="text-[26px] font-semibold text-white tracking-tight leading-[1.2] mb-2">
            Welcome back.
          </h2>
          <p className="text-white/35 text-[15px] leading-relaxed">
            Sign in to manage your events and reservations.
          </p>
        </motion.div>
      </div>


      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[--background] relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.2, 0.6, 0.35, 1] }}
          className="w-full max-w-100"
        >

          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 mb-4">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">EventOps</h1>
          </div>

          <div className="mb-9">
            <h1 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-1.5">
              Sign in
            </h1>
            <p className="text-neutral-500 text-[15px]">
              Enter your credentials to continue.
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
              placeholder="Enter your password"
              required
            />

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
              Sign in
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[12px] text-neutral-400 font-medium select-none">OR</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <p className="mt-6 text-center text-[14px] text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-neutral-900 font-semibold hover:underline underline-offset-4 decoration-neutral-300">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
