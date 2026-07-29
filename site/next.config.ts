import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GoDaddy static-export deploy (future): add BOTH of these together —
  //   output: "export",
  //   images: { unoptimized: true },
  // Every next/image call site breaks at runtime under `output: "export"`
  // without `images.unoptimized`, since there is no optimization endpoint.
};

export default nextConfig;
