import http from '../config/service.config'

export default {
    add(request) {
        return http.post('/import/add', request)
    },
    getTaskHandleResult(req) {
        return http.get('/import/get', {params: req})
    },
    list(request) {
        return http.get('/import/list', {params: request})
    }
}
