import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import lingoCompiler from "lingo.dev/compiler"

export default defineConfig(() =>
  /*lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "it"],
    models: "lingo.dev",
  })*/({
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  })
)