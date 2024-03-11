import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from "path"

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "./src/"),
      "@shared": path.resolve(__dirname, "./../shared/src")
    }
  }
})
