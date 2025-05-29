import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 10000, // Pick any fixed port >1024, like 4173, 5173, or 10000
    host: true, // Enables external access
    allowedHosts: ["faby-clean-client.onrender.com"],
  },
});
