import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // Fixa a raiz no projeto. Sem isso o Turbopack sobe a árvore procurando
    // lockfile e acaba adotando C:\Users\Pichau como root.
    root: projectRoot,
  },
  // O PDF é lido com um caminho montado em runtime, que o tracing do Next não
  // consegue seguir. Sem isto o arquivo não vai junto na função serverless e
  // o download quebra só em produção — o pior lugar para descobrir.
  outputFileTracingIncludes: {
    '/download/[token]': ['./private/**'],
  },
};

export default nextConfig;
