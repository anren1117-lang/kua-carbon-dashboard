import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.(jsx?|tsx?)$/ })],
  esbuild: {
    loader: 'jsx',
    include: /\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 5173,
  },
  build: {
    // Split heavy / rarely-changing third-party deps into their own
    // long-lived cache chunks so app code edits don't bust them. Keeps
    // the initial transfer slim on repeat visits even when the index
    // bundle changes.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':    ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // After the manualChunks split, the largest remaining bundle is
    // the homepage + shared components — well under 600 kB. Bump the
    // warning threshold to silence the noise without hiding a real
    // regression if a future change blows past the limit.
    chunkSizeWarningLimit: 600,
  },
});
