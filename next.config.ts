import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (clinic-media bucket) — uploaded doctor photos,
      // certificates, before/after, gallery, logo. This is the real source.
      {
        protocol: "https",
        hostname: "eabilpzeqjnyqqumvkgp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Legacy demo sources still referenced by seeded reviews (pravatar).
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default withNextIntl(nextConfig);
