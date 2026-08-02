import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'

function copyDir(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const destPath = path.join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-data',
      closeBundle() {
        copyDir(path.resolve(__dirname, 'data'), path.resolve(__dirname, 'dist/data'))
      },
    },
  ],
  base: '/delivery-digest/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
