import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo image sources (no backend in V1). Deterministic + reliable so the
    // client demo never shows broken images. Swap for a real bucket later.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
