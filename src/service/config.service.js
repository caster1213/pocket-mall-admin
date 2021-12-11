import http from '../config/service.config'

export default {
    getOpenFreightConfig() {
        return http.get('config/freight/open')
    },
    getExpressConfig() {
        return http.get('config/express')
    }
}
