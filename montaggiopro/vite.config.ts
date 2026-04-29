import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // In sviluppo senza Docker puoi usare questo proxy
      // per evitare problemi CORS puntando al backend locale
      // "/api": { target: "http://api.localhost", changeOrigin: true }
    },
  },
})
