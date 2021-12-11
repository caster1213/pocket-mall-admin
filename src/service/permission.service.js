import http from '../config/service.config'

export default {
  getMenu() {
    return http.get('/permission/menu')
  },
  getRole() {
    return http.get('/permission/role')
  },
  addRole(request) {
    return http.post('/permission/role/add', request)
  },
  delRole(request) {
    return http.post('/permission/role/del', request)
  },
  updateRole(request) {
    return http.post('/permission/role/update', request)
  }
}
