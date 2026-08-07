import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // Fixa a raiz no projeto. Sem isso o Turbopack sobe a árvore procurando
    // lockfile e acaba adotando C:\Users\Pichau como root.
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
