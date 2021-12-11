import config from '../config/service.config'

export default {
    list(param){
        return config.get('/notice/list',{params:param})
    },
    add(param){
        return config.post('/notice/add',param)
    },
    update(param){
        return config.post('/notice/update',param)
    },
    del(param){
        return config.get('/notice/del', {params:param})
    }
}