"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  // Guard: jika tidak ada token/email di URL, arahkan ke forgot-password
  useEffect(() => {
    if (!token || !email) {
      router.replace("/forgot-password");
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      setSuccess(true);

      // Auto-redirect ke login setelah 3 detik
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block rounded-md bg-brand-crimson/20 border border-brand-crimson/30 px-3 py-1 font-mono text-[10px] font-bold uppercase text-brand-crimson mb-3">
          RESET AKSES
        </span>
        <h1 className="text-2xl font-black font-mono tracking-tight text-white uppercase">
          PASSWORD BARU
        </h1>
        <p className="mt-2 text-xs text-text-muted font-mono">
          Buat password baru untuk akun{" "}
          <span className="text-brand-cyan">{email}</span>
        </p>
      </div>

      {/* Alert Error */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sukses */}
      {success ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
          <p className="text-sm text-green-300 font-mono">
            Password berhasil diubah! Kamu akan diarahkan ke halaman login...
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-dark-border bg-dark-bg/60 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:border-brand-crimson focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Ulangi password baru"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-dark-border bg-dark-bg/60 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:border-brand-crimson focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3 font-mono text-xs font-bold uppercase text-white shadow-[0_0_15px_rgba(255,62,62,0.4)] transition-all hover:bg-brand-crimson/90 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Simpan Password Baru</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-dark-border/60 pt-6 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-brand-cyan hover:underline font-mono"
            >
              ← Kembali ke halaman login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Dibungkus Suspense karena useSearchParams() butuh itu di Next.js 13+
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col justify-between font-sans">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-crimson" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
