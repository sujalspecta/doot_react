import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Maps 'node_modules' explicitly so relative lookups from deep directories resolve properly
      "node_modules": path.resolve(__dirname, "node_modules"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Essential for modern Sass running alongside Vite
        api: "modern-compiler", 
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'if-function', 'color-functions'],
      },
    },
  },
});
