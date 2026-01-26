import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Ensure Next uses this project as the workspace root
    root: __dirname,
  },
};

export default nextConfig;
