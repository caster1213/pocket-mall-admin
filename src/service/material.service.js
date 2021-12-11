import http from '../config/service.config'

export default {
    getList(request) {
        return http.get('/material/list', {params: request})
    },
    getGroupList(request) {
        return http.get('/material/group/list', {params: request})
    },
    addImages(request) {
        return http.post('/material/image/create', request)
    },
    updateImageName(request) {
        return http.post('/material/image/update', request)
    },
    addGroup(request) {
        return http.post('/material/group/create', request)
    },
    deleteGroup(request) {
        return http.get('/material/group/delete', {params: request})
    },
    materialDelete(request){
        return http.get('/material/delete', {params: request})
    },
    materialBulkMove(request){
        return http.post('/material/bulk/move', request)
    },
    materialBulkDelete(request){
        return http.post('/material/bulk/delete', request)
    },

}
