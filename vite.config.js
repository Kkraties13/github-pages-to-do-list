import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/github-pages-to-do-list",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    css: {
    postcss: './postcss.config.js', // Aponta para o arquivo de configuração do PostCSS
    }
  },
})
