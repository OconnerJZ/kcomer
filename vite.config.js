import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
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
