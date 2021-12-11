import axios from '../config/service.config'

export default {
    login(request) {
       return  axios.post('/security/signin',request)
    },
    logout() {
        console.log('logout...')
    }
}