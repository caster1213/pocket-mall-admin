import http from '../config/service.config'

export default {
  list() {
    return http.get('/user/vip/list')
  },
  add(req) {
    return http.post('/user/vip/add', req)
  },
  update(req) {
    return http.post('/user/vip/update', req)
  },
  get(req) {
    return http.get('/user/vip', {params: req})
  },
  enable(req){
    return http.get('/user/vip/enable', {params: req})
  }
}
