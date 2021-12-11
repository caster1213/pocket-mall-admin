import config from '../config/service.config'

export default {
  create (param) {
    return config.post('/employee/add', param)
  },
  update (param) {
    return config.post('/employee/update', param)
  },
  list (param) {
    return config.get('/employee/list', { params: param })
  },
  passwordChanged (param) {
    return config.post('/employee/password/update', param)
  }
}
