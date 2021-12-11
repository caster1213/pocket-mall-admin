import http from '../config/service.config'

export default {
    all() {
        return http.get('/product/category/all')
    },
    add(request) {
        return http.post('/product/category/create', request)
    },
    update(request) {
        return http.post('/product/category/update', request)
    },
    getList(request) {
        return http.get('/product/category/all', {params: request})
    },
    del(request) {
        return http.get('/product/category/delete', {params: request})
    },
    display(request) {
        return http.get('/product/category/display', {params: request})
    },
    get(request){
        return http.get('/product/category', {params: request})
    }
}
