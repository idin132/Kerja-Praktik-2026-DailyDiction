import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Wajib untuk deployment Node.js cPanel standalone
  output: "standalone",

  // 2. Izinkan URL gambar dari localhost, hosting, dan embed website luar
  images: {
    remotePatterns: [
      // Localhost Backend Laravel
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      // Backend / Domain Utama di Hosting
      {
        protocol: "https",
        hostname: "dailydiction.id",
        pathname: "/**",
      },
      // Izinkan semua gambar HTTPS eksternal (Embed link)
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;