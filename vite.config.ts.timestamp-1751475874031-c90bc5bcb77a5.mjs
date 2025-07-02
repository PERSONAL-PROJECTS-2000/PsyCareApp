// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
var vite_config_default = defineConfig(
  () => lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["es", "fr", "de", "zh", "ja", "ar", "hi", "pt", "ru", "it"],
    models: "lingo.dev"
  })({
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"]
    }
  })
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGxpbmdvQ29tcGlsZXIgZnJvbSBcImxpbmdvLmRldi9jb21waWxlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PlxuICBsaW5nb0NvbXBpbGVyLnZpdGUoe1xuICAgIHNvdXJjZVJvb3Q6IFwic3JjXCIsXG4gICAgdGFyZ2V0TG9jYWxlczogW1wiZXNcIiwgXCJmclwiLCBcImRlXCIsIFwiemhcIiwgXCJqYVwiLCBcImFyXCIsIFwiaGlcIiwgXCJwdFwiLCBcInJ1XCIsIFwiaXRcIl0sXG4gICAgbW9kZWxzOiBcImxpbmdvLmRldlwiLFxuICB9KSh7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICB9LFxuICB9KVxuKSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVE7QUFBQSxFQUFhLE1BQzFCLGNBQWMsS0FBSztBQUFBLElBQ2pCLFlBQVk7QUFBQSxJQUNaLGVBQWUsQ0FBQyxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU0sTUFBTSxJQUFJO0FBQUEsSUFDMUUsUUFBUTtBQUFBLEVBQ1YsQ0FBQyxFQUFFO0FBQUEsSUFDRCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUMxQjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
