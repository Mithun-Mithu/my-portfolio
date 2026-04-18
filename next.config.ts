import type { NextConfig } from "next";

const basePath = "/my-portfolio";
const assetPrefix = basePath ? `${basePath}/` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix,
};

export default nextConfig;
