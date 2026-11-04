import type { NextConfig } from "next";

// Spanish is the default language and lives at the root ("/", "/ubicaciones/...").
// English lives under "/en". Internally both are served by app/[lang].
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/es" },
        { source: "/ubicaciones/:slug", destination: "/es/ubicaciones/:slug" },
        { source: "/reservar", destination: "/es/reservar" },
        { source: "/reservar/:slug", destination: "/es/reservar/:slug" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    // Keep one public URL per Spanish page.
    // ("/es" itself just shows the Spanish home page.)
    return [{ source: "/es/:path+", destination: "/:path+", permanent: false }];
  },
};

export default nextConfig;
