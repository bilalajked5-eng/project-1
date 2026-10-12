import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

/** Builds the entire site into one self-contained HTML file. */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    target: 'es2020',
    outDir: 'dist-single',
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(__dirname, 'single.html') },
  },
})
