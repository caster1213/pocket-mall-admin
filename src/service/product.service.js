import http from '../config/service.config'

export default {
  list(param) {
    return http.get('/product/list', {params: param})
  },
  groupList(param) {
    return http.get('/product/group/list', {params: param})
  },
  get(param) {
    return http.get('/product/single', {params: param})
  },
  add(param) {
    return http.post('/product/add', param)
  },
  update(param) {
    return http.post('/product/update', param)
  },
  updateIndex(param) {
    return http.post('/product/update/index', param)
  },
  getProductGroup: (query) => http.get('/product/group', {params:query}),
  updateGroup: (param) => http.post('/product/group/update/', param),
  updateBatchGroup: (param) => http.post('/product/group/update/batch', param),
  addGroup: (param) => http.post('/product/group/add', param),
  deleteGroup: (param) => http.get('/product/group/delete', {params: param}),
  deleteProduct(param) {
    return http.get('/product/del', {params: param})
  },
  getProductGroupStatus(id) {
    let result = http.all([http.get('/product/group/list', {
      params: {
        pageIndex: 1,
        pageSize: 100
      }
    }), http.get('/product/group/item/find', {params: {id: id}})])
    return new Promise((resolve, reject) => {
      result.then(http.spread((res1, res2) => {
        let p = res2.data.result
        let list = res1.data.result.list.map(x => {
          if (p.length === 0) {
            x.check = false
            x.defaultCheck = false
          }
          if (p.length > 0 && p.find(c => c.id === x.id) !== undefined) {
            x.check = true
            x.defaultCheck = true
          } else {
            x.check = false
            x.defaultCheck = false
          }
          return x
        })
        resolve(list)
      })).catch(err => {
        reject(err)
      })
    })
  },

  addSkuAttributeName(req) {
    return http.post('/product/sku/attribute/create', req)
  },
  addSkuAttributeValue(req) {
    return http.post('/product/sku/value/create', req)
  },
  deleteSkuAttributeValue(req) {
    return http.get('/product/sku/value/delete', {params: req})
  },
  getProductSkuAttributes(request) {
    return http.get('/product/sku/attributes', {params: request})
  },
  getProductSkuAttributeValue(request) {
    return http.get('/product/sku/values', {params: request})
  },
  updateProductStatus(request) {
    return http.post('/product/update/status', request)
  },
  getMemberPrice(req) {
    return http.get('/product/member/price', {params: req})
  },
  updateMemberPrice(req) {
    return http.post('/product/member/price/update', req)
  }
}
