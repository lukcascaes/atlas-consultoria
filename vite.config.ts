/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // O core é puro (sem DOM), então o ambiente Node basta e é mais rápido.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
