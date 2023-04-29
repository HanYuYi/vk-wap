import { fileURLToPath, URL } from "node:url"

import { defineConfig, splitVendorChunkPlugin } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Components from "unplugin-vue-components/vite"
import { VantResolver } from "unplugin-vue-components/resolvers"
import Unocss from "unocss/vite"
import { presetAttributify, presetUno } from "unocss"
import { visualizer } from "rollup-plugin-visualizer"
import { compression } from "vite-plugin-compression2"
import { chunkSplitPlugin } from "vite-plugin-chunk-split"
import legacy from "@vitejs/plugin-legacy"

const renameIndexPlugin = (newFilename: string) => {
    if (!newFilename) return

    return {
        name: "renameIndex",
        enforce: "post",
        generateBundle(options: unknown, bundle: any) {
            const indexHtml = bundle["index.html"]
            indexHtml.fileName = newFilename
        }
    }
}

//测试环境
const targetUrl: string = "http://vkwapapi.mibogame.com"

// https://vitejs.dev/config/
export default defineConfig({
    assetsInclude: ["svga"],
    plugins: [
        vue(),
        vueJsx(),
        Unocss({
            presets: [
                presetAttributify({
                    /* preset options */
                }),
                presetUno()
                // ...custom presets
            ],
            shortcuts: [
                ["flex-center", "flex items-center justify-center"],
                ["hstack", "flex items-center"],
                ["vstack", "flex justify-center"],
                ["primary-btn", "from-dark-green to-primary-green bg-gradient-to-r"],
                ["ab-center", "absolute top-50% left-50% translate-x--50% translate-y--50%"],
                ["rotate-1round", "rotate-180 ease-linear duration-500 transition-transform"]
            ],
            theme: {
                colors: {
                    pageColor: "#f8fcfe",
                    mypageColor: "#f6f8f8",
                    primaryText: "#222",
                    secondText: "#4b566b",
                    oldText: "#262933",
                    lightText: "#7c839f",
                    newText: "#30403a",
                    darkGreen: "#07e9f1",
                    primaryGreen: "#07f1b7",
                    borderGreen: "#07ecda",
                    lightGreen: "#e8f1ef"
                },
                boxShadow: {
                    btn: "0px 2.5px 13.5px 0 rgba(0, 0, 0, 0.2)"
                },
                fontFamily: {
                    robot: ["Roboto"]
                }
            }
        }),
        Components({
            dts: true,
            resolvers: [VantResolver()],
            types: [
                {
                    from: "vue-router",
                    names: ["RouterLink", "RouterView"]
                }
            ]
        }),
        splitVendorChunkPlugin(),
        chunkSplitPlugin({
            customSplitting: {
                "vue-vendor": ["vue"],
                "vuerouter-vendor": ["vue-router"],
                "pinia-vendor": ["pinia"],
                "axios-vendor": ["axios"],
                "svga-vendor": ["svga"],
                "vue3Marquee-vendor": ["vue3-marquee"],
                "gsap-vendor": ["gsap"],
                "pixi-vendor": ["pixi.js"],
                "swiper-vendor": ["swiper"],
                "dplayer-vendor": ["dplayer"],
                "flv-vendor": ["flv.js"],
                "hls-vendor": ["hls.js"],
                "vue-clipboard3-vendor": ["vue-clipboard3"],
                "dayjs-vendor": ["dayjs"],
                "vue3-carousel-3d-vendor": ["vue3-carousel-3d"],
                "vue3-touch-events-vendor": ["vue3-touch-events"],
                "vue3-danmaku-vendor": ["vue3-danmaku"]
            }
        }),
        {
            ...compression(),
            ...visualizer(),
            apply: "build"
        },
        // @ts-ignore
        renameIndexPlugin("wap.html"),
        legacy({
            targets: ["defaults", "not IE 11"]
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        host: true,
        open: true,
        base: "/",
        proxy: {
            "/api": {
                target: targetUrl,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            },
            "/static": {
                target: targetUrl,
                changeOrigin: true
            },
            "/uploads": {
                target: targetUrl,
                changeOrigin: true
            },
            // 资讯图片
            "/ueditor": {
                target: targetUrl,
                changeOrigin: true
            }
        }
    },
    preview: {
        port: 9999
    },
    build: {
        assetsDir: "wap_static",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true // 删除console语句
            },
            format: {
                comments: false // 移除注释
            }
        }
    }
})
