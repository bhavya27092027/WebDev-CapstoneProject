import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ['react-toastify', 'framer-motion', 'recharts']
  },
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    allowedHosts: true,
    host: true,
  },
  esbuild: {
    logOverride: {
      'ignored-directive': 'silent',
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.message.includes('Module level directives') ||
          warning.message.includes('"use client"') ||
          warning.message.includes('"was ignored"')
        ) {
          return;
        }

        if (warning.code === 'UNRESOLVED_IMPORT') {
          throw new Error(`Build failed due to unresolved import:\n${warning.message}`);
        }

        if (warning.code === 'PLUGIN_WARNING' && /is not exported/.test(warning.message)) {
          throw new Error(`Build failed due to missing export:\n${warning.message}`);
        }

        warn(warning);
      },
    },
  },
});
