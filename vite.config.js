import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs-extra';

// 复制_locales和assets目录的插件
const copyAssetsPlugin = () => ({
  name: 'copy-assets',
  async writeBundle() {
    // 复制_locales目录
    if (fs.existsSync(resolve(__dirname, '_locales'))) {
      await fs.copy(
        resolve(__dirname, '_locales'),
        resolve(__dirname, 'dist/_locales')
      );
    }
    // 复制assets目录
    if (fs.existsSync(resolve(__dirname, 'assets'))) {
      await fs.copy(
        resolve(__dirname, 'assets'),
        resolve(__dirname, 'dist/assets')
      );
    }
  },
});

// 复制文件到根目录的插件
const copyToRootPlugin = () => ({
  name: 'copy-to-root',
  async writeBundle() {
    // 复制构建后的JS文件
    const files = ['popup.js', 'background.js', 'content.js'];
    for (const file of files) {
      if (fs.existsSync(resolve(__dirname, 'dist', file))) {
        await fs.copy(
          resolve(__dirname, 'dist', file),
          resolve(__dirname, file)
        );
      }
    }
    
    // 复制CSS文件
    await fs.copy(
      resolve(__dirname, 'src/styles/popup.css'),
      resolve(__dirname, 'popup.css')
    );
    
    // 复制并修改popup.html
    let htmlContent = await fs.readFile(resolve(__dirname, 'src/popup/popup.html'), 'utf-8');
      
    // 注入脚本和样式
    const injectedTags = `
    <script type="module" src="popup.js"></script>
    <link rel="stylesheet" href="popup.css">`;
      
    // 在</head>前插入标签
    htmlContent = htmlContent.replace('</head>', `${injectedTags}\n</head>`);
      
    // 写入文件
    await fs.writeFile(resolve(__dirname, 'popup.html'), htmlContent);
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyAssetsPlugin(), copyToRootPlugin()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.jsx'),
        background: resolve(__dirname, 'src/background/background.js'),
        content: resolve(__dirname, 'src/content/content.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        format: 'es'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
