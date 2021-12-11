import config from '../config/service.config'

export default {
    list(param) {
        return config.get('/rebate/list', {params: param})
    },
    approve(param) {
        return config.post('/rebate/approve', param)
    },
    confirm(param) {
        return config.post('/rebate/confirm/exchange', param)
    },
    confirmExchangeRebate(param) {
        return config.post('/rebate/confirm/exchange/rebate', param)
    },
    completed(param) {
        return config.post('/rebate/complete', param)
    },
    refuse(param) {
        return config.post('/rebate/refuse', param)
    },
    get(param) {
        return config.get('/rebate', {params: param})
    }
}
