import axios from 'axios'
import store from '../store'

axios.defaults.baseURL = process.env.VUE_APP_SERVICE_URL
axios.defaults.timeout = 15000
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
    if (config.url !== 'login') {
        config.headers.common['access-token'] = store.state.token
    }
    if (config.method === 'post') {
        config.params = JSON.stringify(config.params)
    }
    if (config.method === 'get') {
        if (config.params === undefined) {
            config.params = {
                v: (new Date()).valueOf()
            }
        } else {
            config.params.v = (new Date()).valueOf()
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
axios.interceptors.response.use(config => {
    return config
}, (error) => {
    if (error.response.status === 401) {
        window.instance.$router.push('/error/403').then()
    } else if (error.response.status === 403) {
        window.instance.$router.push('/error/403').then()
    } else if (error.response.status === 500) {
        window.instance.$message.error('网络请求错误！')
    } else if (error.response.status === 404) {
        window.instance.$message.error('功能已取消或者不存在！')
    }
})

export default axios
