import http from "@/config/service.config"

let add = (args) => http.post('/coupon/add', args)
let update = (args) => http.post('/coupon/update', args)
let get = (args) => http.get('/coupon', {params: args})
let list = (args) => http.get('/coupon/list', {params: args})

export {
    add,
    update,
    get,
    list
}
