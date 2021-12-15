import http from "@/config/service.config"

let add = (args) => {
    return http.post('', args)
}

let update = (args) => {
    return http.post('', args)
}

let get = (args) => {
    return http.get('', {params: args})
}
let list = (args) => {
    return http.get('', {params: args})
}

export {
    add,
    update,
    get,
    list
}
