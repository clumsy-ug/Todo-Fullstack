import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js', // 必要に応じて設定ファイルを指定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.jsx',  // main.jsxをカバレッジレポートから除外する(main.jsxはテスト対象外)
        '.eslintrc.cjs',
        'vite.config.js',
        'node_modules/**'
      ],
    },
  },
})
