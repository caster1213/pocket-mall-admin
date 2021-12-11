import http from '../config/service.config'

export default {
    add(args) {
        return http.post('point/activity/add', args)
    },
    list(query) {
        return http.get('point/activity/list', {params: query})
    },
    get(query) {
        return http.get('point/activity', {params: query})
    },
    update(args) {
        return http.post('point/activity/update', args)
    },
    del(query) {
        return http.get('point/activity/delete', {params: query})
    },
    expire(query) {
        return http.get('point/activity/expire', {params: query})
    }
}