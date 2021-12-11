import http from '../config/service.config'

export default {
    getDashboard() {
        return http.get('/report/dashboard')
    },
    getGoodsCount(req) {
        return http.get('/finance/cost/goods', {params: req})
    },
    getDailyPaymentCount(req) {
        return http.get('/finance/daily/payment', {params: req})
    },
    getGroupBuyIndexPage(req) {
        return http.get('/data/groupbuy', {params: req})
    },
    getGroupCoreTarget(req) {
        return http.get('/data/groupbuy/target', {params: req})
    }
}
