import config from '../config/service.config'

export default {
    transactionList (param) {
        return config.get('/account/history', { params: param })
    },
    withdrawalList (param) {
        return config.get('/finance/withdrawal', { params: param })
    },
    withdrawApprove(param){
        return config.post('/finance/withdrawal/approve',param)
    },
    withdrawCompleted(param){
        return config.post('/finance/withdrawal/complete',param)
    },
    withdrawRefuse(param){
        return config.post('/finance/withdrawal/refuse',param)
    },
    appendValue(param) {
        return config.post('/account/append/value', param)
    },
    rechargeAmount(param){
        return config.post('/account/recharge', param)
    }
}
