import http from '../config/service.config'

export default {
    gerList(request) {
        return http.get('/spell/list', {params: request})
    },
    get(request){
        return http.get('/spell', {params: request})
    },
    add(request) {
        return http.post('/activity/spell/add', request)
    },
    update(request) {
        return http.post('/activity/spell/update', request)
    },
    start(request) {
        return http.get('/spell/start', {params: request})
    },
    finish(request) {
        return http.get('/spell/finish', {params: request})
    },
    addProduct(request) {
        return http.post('/spell/product/add', request)
    },
    deleteProduct(request) {
        return http.post('/spell/product/delete', request)
    },
    del(request){
        return http.get('/spell/delete', {params: request})
    }
}
