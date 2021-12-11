import config from '../config/service.config'

export default {
    list(param) {
        return config.get('/order/list', {params: param})
    },
    del(param) {
        return config.get('/order/delete', {params: param})
    },
    get(param) {
        return config.get('/order', {params: param})
    },
    deliver(param) {
        return config.post('/order/delivery', param)
    },
    getDeliveryOrder(param) {
        return config.get('/order/delivery', {params: param})
    },
    export(param) {
        return config.get('/order/export', {params: param})
    },
    cancel(param) {
        return config.post('/order/cancel', param)
    },
    setMarket(req) {
        return config.post('/order/market', req)
    },
    deleteMarker(req) {
        return config.post('/order/market/delete', req)
    },
    updateAddress(req) {
        return config.post('/order/address/update', req)
    },
    priceChanged(req) {
        return config.post('/order/item/update', req)
    },
    verificationConfirm(req) {
        return config.post('/order/verification/confirm', req)
    },
    rebate(param) {
        return config.post('/order/rebate', param)
    },
    getRebateAmountList(param){
        return config.get('/order/rebate/amount/list', {params: param})
    },
    getRebateSaleList(param){
        return config.get('/order/rebate/amount/sale/list', {params: param})
    }
}
