import http from '../config/service.config'

export default {
    getRuleData() {
        return http.get('/point/rule')
    },
    updateCommonRule(args) {
        return http.post('/point/rule/common/update', args)
    },
    addCustomRule(args) {
        return http.post('/point/rule/custom/add', args)
    },
    updateCustomRule(args) {
        return http.post('/point/rule/custom/update', args)
    },
    getCustomRule(args) {
        return http.get('/point/rule/custom', {params: args})
    },
    getPointTx(args) {
        return http.get('/point/tx', {params: args})
    },
    updateUserPoint(args) {
        return http.post('/point/user/update', args)
    }
}
