import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @jspawn/qpdf-wasm imports Node built-ins (fs, path, module) at module evaluation
  // time. Exclude it from server-side bundling so SSR pre-render doesn't try to
  // evaluate it. The pages that use it are 'use client' and only call the module
  // inside async event handlers, so no server-side execution is needed.
  serverExternalPackages: ['@jspawn/qpdf-wasm'],
};

export default nextConfig;
