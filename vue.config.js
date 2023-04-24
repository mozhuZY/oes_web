const {defineConfig} = require('@vue/cli-service')

const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    // 开启服务器代理（仅用于开发过程中）
    devServer: {
        open: false,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
            }
        },
        port: 3000
    },
    // 自动导入ElementPlus组件和样式
    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
        ]
    }
})