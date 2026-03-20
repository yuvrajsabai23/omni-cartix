"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        // Always show success to prevent email enumeration
        setSent(true);
      }
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <span className="text-base font-bold text-white">OC</span>
            </div>
            <span className="text-2xl font-heading font-bold gradient-text">Omni Cartix</span>
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/20 mx-auto mb-4">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-white/60 text-sm mb-6">
                If an account exists for {email}, we&apos;ve sent a password reset link. Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full bg-gradient-primary text-white">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
              <p className="text-white/50 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white/70 text-sm">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-white hover:opacity-90 py-5" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send Reset Link
                </Button>
              </form>
              <Link href="/auth/signin" className="mt-4 flex items-center justify-center gap-1 text-sm text-white/50 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
