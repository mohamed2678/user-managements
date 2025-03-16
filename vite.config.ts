import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // إضافة هذا السطر لاستخدام البناء الصحيح لـ Vue
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
});
