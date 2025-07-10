import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: './', // Adding this - relative paths
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        analysis: resolve(__dirname, 'analysis.html'),
        gsap: resolve(__dirname, 'gsap-version/index.html'),
        vanilla: resolve(__dirname, 'vanilla-version/index.html')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return 'css/[name][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return 'images/[name][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'fonts/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2015',
    minify: 'terser'
  },
  css: {
    preprocessorOptions: {
      scss: {}
    },
    postcss: {
      plugins: []
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['gsap', 'three']
  }
}) 