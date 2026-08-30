import type { NextConfig } from "next";

// The Studio origins allowed to frame this site. Presentation renders the site
// in an iframe, so a blanket X-Frame-Options: DENY would break the whole
// preview loop. frame-ancestors is the modern equivalent and, unlike
// X-Frame-Options, takes a list: everything except these two is still refused.
const STUDIO_ORIGINS = [
  "https://richardthedesigner.sanity.studio",
  "http://localhost:3333",
];

const nextConfig: NextConfig = {
  // Overridable so CI/sandbox builds don't fight a locally-owned .next dir.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${STUDIO_ORIGINS.join(" ")}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
