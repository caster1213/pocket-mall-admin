import http from 'axios'

export default {
  add(model) {
    return http.post('/activity/package/discount/add', model)
  },
  update(model) {
    return http.post('/activity/package/discount/update', model)
  },
  get(query) {
    return http.get('/activity/package/discount', {params: query})
  },
  del(query) {
    return http.get('/activity/package/delete', {params: query})
  },
  list(query) {
    return http.get('/activity/package/discount/list', {params: query})
  },
  expire(query) {
    return http.get('/activity/package/expire', {params: query})
  }
}
