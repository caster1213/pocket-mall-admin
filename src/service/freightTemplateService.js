import http from '../config/service.config'

export default {
    add(request) {
        return http.post('freight/template/add', request)
    },
    list(request) {
        return http.get('freight/template/list', {params: request})
    },
    del(request) {
        return http.get('freight/template/delete', {params: request})
    },
    defaultTemplate(request) {
        return http.get('freight/template/default', {params: request})
    },
    get(request) {
        return http.get('freight/template', {params: request})
    },
    update(request) {
        return http.post('freight/template/update', request)
    },
    updateConfig(request){
        return http.post('freight/template/update/config', request)
    },
    openOrClose(){
        return http.post('freight/template/config/open')
    }
}
