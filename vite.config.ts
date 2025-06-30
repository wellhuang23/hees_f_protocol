import {
  defineConfig,
  loadEnv
} from 'vite'
import type {
  UserConfig,
  ConfigEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {
  name,
  version,
  dependencies,
  devDependencies,
} from "./package.json";

const __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      // host: 'localhost', // 只能 Localhost 與許訪問
      host: '0.0.0.0', // 區網內允許訪問
      port: Number(env.VITE_APP_PORT),
      // Run 自動打開 Browser
      // open: true,
      proxy: {
        [env.VITE_OMS_API]: {
          target: env.VITE_OMS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_OMS_API), '/api'),
        },
      },
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src'
        }
      ]
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})
