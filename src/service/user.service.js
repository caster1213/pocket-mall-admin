import config from '../config/service.config'

export default {
    get(param) {
        return config.get('/user', {params: param})
    },
    list(param) {
        return config.get('/user/list', {params: param})
    },
    append(param) {
        return config.post('/user/append', param)
    },
    del(param) {
        return  config.get('/user/delete', {params: param})
    },
    getChildren(param){
        return config.get('/user/children', {params: param})
    },
    loadTree(param){
        return config.get('/user/tree', {params: param})
    },
    nextTree(param){
        return config.get('/user/tree/next', {params: param})
    }
}
