import http from '../config/service.config'

export default {
    getProductList(request) {
        return http.get('/activity/product', {params: request})
    }
}
