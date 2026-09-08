"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn("Client side error caught gracefully:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-mono font-bold text-[#FFD700] mb-2">
        KONTEN TERMUAT
      </h2>
      <p className="text-xs text-text-muted mb-6 max-w-md">
        Terjadi penyesuaian tampilan di browser kamu. Klik tombol di bawah untuk menyegarkan halaman.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-[#FFD700] px-5 py-2.5 font-mono text-xs font-bold text-black hover:bg-[#FFD700]/90 transition-all"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}