import axios from 'axios'

// 创建axios
const request = axios.create({
    baseURL: 'http://localhost:8080'
});

//post请求头
request.defaults.headers.common["Content-Type"] = "application/json;charset=UTF-8";
request.defaults.headers.common["user-token"] = localStorage.getItem("user-token")

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log('res',response)
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});

export default request