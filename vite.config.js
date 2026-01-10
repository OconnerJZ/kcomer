import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteBasicSslPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png"],
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
      "@Api": path.resolve(__dirname, "src/api"),
      "@Assets": path.resolve(__dirname, "src/assets"),
      "@Components": path.resolve(__dirname, "src/components"),
      "@Config": path.resolve(__dirname, "src/config"),
      "@Const": path.resolve(__dirname, "src/const"),
      "@Context": path.resolve(__dirname, "src/context"),
      "@Hooks": path.resolve(__dirname, "src/hooks"),
      "@Pages": path.resolve(__dirname, "src/pages"),
      "@Redux": path.resolve(__dirname, "src/redux"),
      "@Services": path.resolve(__dirname, "src/services"),
      "@Utils": path.resolve(__dirname, "src/utils"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
});
