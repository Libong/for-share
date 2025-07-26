import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag === 'fedropshadow'
                }
            }
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        // extensions: ['.vue', '.js', '.ts', '.pug'],
    },
})
