import http from '../config/service.config'

export default {
    list(param) {
        return http.get('/activity/spell/list', {params: param})
    },
    add(param) {
        return http.post('/activity/spell/add', param)
    },
    disable(param) {
        return http.get('/activity/disable', {params: param})
    },
    getHistoryList(param) {
        return http.get('/activity/history/list', {params: param})
    },
    open(param) {
        return http.get('/activity/spell/open', {params: param})
    },
    close(param) {
        return http.get('/activity/spell/close', {params: param})
    },
    get(param) {
        return http.get('/activity/spell', {params: param})
    },
    addProduct(param) {
        return http.post('/activity/spell/product/add', param)
    },
    updateProduct(param) {
        return http.post('/activity/spell/product/update', param)
    },
    deleteProduct(param) {
        return http.get('/activity/spell/product/delete', {params:param})
    },
    getProductList(param) {
        return http.get('/activity/spell/product/list', {params: param})
    },
    getUser(param){
        return http.get('/activity/spell/user/history', {params: param})
    }
}
