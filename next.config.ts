import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @jspawn/qpdf-wasm imports Node built-ins (fs, path, module) at module evaluation
  // time. Exclude it from server-side bundling so SSR pre-render doesn't try to
  // evaluate it. The browser loads the glue at runtime from public/qpdf/ (see
  // lib/pdf/qpdf.ts), and the Node/test branch imports the package directly — this
  // keeps that direct import external on the server so its Node built-ins aren't
  // pulled into a bundle.
  serverExternalPackages: ['@jspawn/qpdf-wasm'],
};

export default nextConfig;
