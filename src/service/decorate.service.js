import http from '../config/service.config'

export default {

  homePageSave(request){
    return http.post('/decorate/page/home',request)
  },
  publish(){
    return http.get('/decorate/page/home/publish')
  },
  getHomePageConfig(){
    return http.get('/decorate/page/home/config')
  }
}
