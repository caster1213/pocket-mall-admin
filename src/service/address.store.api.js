import http from '../config/service.config'

export default {
    get(request) {
        return http.get('/address/store',{params: request})
    },
    list(request) {
        return http.get('/address/store/list', {params: request})
    },
    add(request) {
        return http.post('/address/store/add', request)
    },
    update(request) {
        return http.post('/address/store/update', request)
    },
    del(request) {
        return http.get('/address/store/delete',{params: request})
    }
}
