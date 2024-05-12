import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        //打包后文件目录
        outDir: "es",
        //压缩
        minify: false,
        rollupOptions: {
            //忽略打包vue文件
            external: ["vue"],
            //input: ["index.ts"],
            output: {
                globals: {
                    vue: "Vue",
                },
                dir: "dist",
            },
        },
        lib: {
            entry: "./index.js",
            name: "markliu2013",
            fileName: "markliu2013",
            formats: ["es", "umd", "cjs"],
        },
    },
    plugins: [vue()],
})
