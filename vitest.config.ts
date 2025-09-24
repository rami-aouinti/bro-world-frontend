import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '~': projectRoot,
      '@': projectRoot,
      '~~': projectRoot,
      '@@': projectRoot,
    },
  },
})
