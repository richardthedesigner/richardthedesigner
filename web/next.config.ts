import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Overridable so CI/sandbox builds don't fight a locally-owned .next dir.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
