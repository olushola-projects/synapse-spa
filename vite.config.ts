import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react-helmet']
  },
  build: {
    // Production build optimizations
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          router: ['react-router-dom'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Environment variable validation and injection
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // CDK will inject these during deployment
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://localhost:3000'
    ),
    'import.meta.env.VITE_API_TIMEOUT': JSON.stringify(process.env.VITE_API_TIMEOUT || '30000')
  },
  // Performance optimizations
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
