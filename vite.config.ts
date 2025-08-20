import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react({
      // Enable React DevTools in development
      devTarget: mode === 'development' ? 'esnext' : 'es2015'
    }),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          charts: ['recharts'],
          router: ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}));
