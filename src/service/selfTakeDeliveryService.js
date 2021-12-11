import http from '../config/service.config'

export default {
    getConfig() {
        return http.get('/std/config')
    },
    updateConfig(content) {
        return http.post('/std/config/update', content)
    },
    add(req) {
        return http.post('/std/add', req)
    },
    update(req) {
        return http.post('/std/update', req)
    },
    getList(req) {
        return http.get('/std/list', {params: req})
    },
    updateStatus(req){
        return http.get('/std/update/status', {params: req})
    },
    get(req){
        return http.get('/std', {params: req})
    },
    del(req){
        return http.get('/std/delete', {params: req})
    }
}
