"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Mail, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://dailydiction.id/api/v1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const endpoint = isRegister ? `${apiUrl}/register` : `${apiUrl}/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan, periksa input Anda.");
      }

      // Simpan kredensial login di LocalStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      // Kembali ke halaman sebelumnya atau beranda
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block rounded-md bg-brand-crimson/20 border border-brand-crimson/30 px-3 py-1 font-mono text-[10px] font-bold uppercase text-brand-crimson mb-3">
              MEMBER ACCESS
            </span>
            <h1 className="text-2xl font-black font-mono tracking-tight text-white uppercase">
              {isRegister ? "BUAT AKUN BARU" : "MASUK KE AKUN"}
            </h1>
            <p className="mt-2 text-xs text-text-muted font-mono">
              {isRegister
                ? "Daftar untuk ikut berdiskusi dan berkomentar di artikel."
                : "Masuk untuk menulis komentar dan berinteraksi."}
            </p>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 font-mono">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
                  Nama Lengkap / Panggilan
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: GamerSejati"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-dark-border bg-dark-bg/60 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:border-brand-crimson focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-dark-border bg-dark-bg/60 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:border-brand-crimson focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-1.5 uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  <span>{isRegister ? "Daftar Sekarang" : "Masuk"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Switcher */}
          <div className="mt-6 border-t border-dark-border/60 pt-6 text-center">
            <p className="text-xs text-text-muted font-mono">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMessage("");
                }}
                className="font-bold text-brand-cyan hover:underline ml-1"
              >
                {isRegister ? "Masuk di sini" : "Daftar gratis"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}