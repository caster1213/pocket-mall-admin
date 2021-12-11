import http from '../config/service.config'
export default {
    list(param){
        return http.get('/activity/envelope/list', {params:param})
    },
    add(param){
        return http.post('/activity/envelope/add',param)
    },
    disable(param){
        return http.get('/activity/envelope/disable',{params:param})
    },
    getHistoryList(param){
        return http.get('/activity/envelope/history/list', {params:param})
    }
}
