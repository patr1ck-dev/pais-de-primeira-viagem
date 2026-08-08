import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Resolve os aliases @/... do tsconfig, para os testes importarem igual
    // ao app. Nativo no Vite — dispensa o vite-tsconfig-paths.
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
