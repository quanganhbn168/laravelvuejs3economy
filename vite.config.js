import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vuetify from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css", // CSS chính của ứng dụng
                "resources/js/app.js", // JS chính của ứng dụng
            ],
            refresh: true, // Tự động làm mới khi thay đổi tệp Blade
        }),
        vue(),
        vueJsx(),

        // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
        vuetify({
            styles: {
                configFile:
                    "resources/js/assets/styles/variables/_vuetify.scss",
            },
        }),
        Components({
            dirs: ["resources/js/@core/components", "resources/js/components"],
            dts: true,
            resolvers: [
                (componentName) => {
                    // Auto import `VueApexCharts`
                    if (componentName === "VueApexCharts")
                        return {
                            name: "default",
                            from: "vue3-apexcharts",
                            as: "VueApexCharts",
                        };
                },
            ],
        }),

        // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
        AutoImport({
            imports: [
                "vue",
                "vue-router",
                "@vueuse/core",
                "@vueuse/math",
                "pinia",
            ],
            vueTemplate: true,

            // ℹ️ Disabled to avoid confusion & accidental usage
            ignore: ["useCookies", "useStorage"],
            eslintrc: {
                enabled: true,
                filepath: "./.eslintrc-auto-import.json",
            },
        }),
        svgLoader(),
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./resources/js", import.meta.url)),
            "@core": fileURLToPath(
                new URL("./resources/js/@core", import.meta.url)
            ),
            "@layouts": fileURLToPath(
                new URL("./resources/js/@layouts", import.meta.url)
            ),
            "@images": fileURLToPath(
                new URL("./resources/js/assets/images/", import.meta.url)
            ),
            "@styles": fileURLToPath(
                new URL("./resources/js/assets/styles/", import.meta.url)
            ),
            "@configured-variables": fileURLToPath(
                new URL(
                    "./resources/js/assets/styles/variables/_template.scss",
                    import.meta.url
                )
            ),
        },
    },
    build: {
        chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
        exclude: ["vuetify"],
        entries: ["./resources/js/**/*.vue"],
    },
});
