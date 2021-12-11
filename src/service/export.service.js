import http from '../config/service.config'

export default {
  list(req) {
    return http.get('/data/export/list', {params: req})
  },
  del(req) {
    return http.post('/data/export/del', req)
  },
  exportGoodsCost(req) {
    return http.get('/data/export/goods/cost', {params: req})
  },
  exportDailyPayment(req) {
    return http.get('/data/export/daily/payment', {params: req})
  },
  exportWithdraw(req) {
    return http.get('/finance/withdraw/export', {params: req})
  }
}
