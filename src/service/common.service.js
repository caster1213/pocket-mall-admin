import config from '../config/service.config'

export default {
    getFieldConfig() {
        return config.get('/common/field/list')
    },
    updateFieldConfig(param) {
        return config.post('/common/field/update', param)
    },
    getBannerList(param) {
        return config.get('/common/banner/list', {params: param})
    },
    addBanner(param) {
        return config.post('/common/banner/add', param)
    },
    updateBanner(param) {
        return config.post('/common/banner/update', param)
    },
    deleteBanner(param) {
        return config.get('/common/banner/delete', {params: param})
    }
}
