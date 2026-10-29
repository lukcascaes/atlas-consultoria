/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  // Caminhos relativos: o site funciona em qualquer subpasta, como usuario.github.io/nome-do-repo/.
  // Como as telas usam #/rota, não há problema de rota com base relativa.
  base: './',
  test: {
    // O core é puro (sem DOM), então o ambiente Node basta e é mais rápido.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
