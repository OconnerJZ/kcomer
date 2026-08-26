import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    viteBasicSslPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png"],
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: "qsCome",
        short_name: "qsCome",
        description: "Mi app para encontra mi comida de hoy",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    https: true,
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@App": path.resolve(__dirname, "src/app"),
      "@Features": path.resolve(__dirname, "src/features"),
      "@Shared": path.resolve(__dirname, "src/shared"),
      "@Assets": path.resolve(__dirname, "src/assets"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
});
