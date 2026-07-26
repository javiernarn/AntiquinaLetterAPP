import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
      output: {
        manualChunks: {
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
          "vendor-motion": ["framer-motion"],
          "vendor-react": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
