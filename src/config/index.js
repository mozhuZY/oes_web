// axios封装配置
export default {
    development: {
        baseUrl: 'http://localhost:3000' // 测试接口域名
    },
    beta: {
        baseUrl: '' // 测试接口域名
    },
    release: {
        baseUrl: '' // 正式接口域名
    },
    production: {
        baseUrl: '' // 生产环境域名
    }
}