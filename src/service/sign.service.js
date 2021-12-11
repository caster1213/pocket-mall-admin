import http from '../config/service.config'

export default {
    get() {
        return http.get('/sign')
    },
    close() {
        return http.post('/sign/close')
    },
    open() {
        return http.post('/sign/open')
    },
    update(args) {
        return http.post('/sign/update', args)
    },
    getCycleList(query) {
        return http.get('/sign/cycle', {params: query})
    },
    getUserSignList(query) {
        return http.get('/sign/user', {params: query})
    },
    getSignCount() {
        return http.get('/sign/count')
    }
}
