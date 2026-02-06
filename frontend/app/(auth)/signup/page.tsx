"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-600">Join EventOps today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("PARTICIPANT")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === "PARTICIPANT"
                      ? "bg-violet-100 text-violet-700 ring-2 ring-violet-500 ring-offset-1"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Participant
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === "ADMIN"
                      ? "bg-violet-100 text-violet-700 ring-2 ring-violet-500 ring-offset-1"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
              Sign Up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 font-medium hover:text-violet-700">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
