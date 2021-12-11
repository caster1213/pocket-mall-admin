import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        nickname: '',
        role: '',
        menus: [],
        routes:[{
            path: '/',
            name: '首页'
        }],
        defaultMenuOpen: ['1'],
        defaultMenuSelected: ['1-1']
    },
    getters: {
        isLogin: state => {
            if (state.token === '' || state.token === null) {
                return false
            } else {
                return true
            }
        }
    },
    mutations: {
        setToken(state, value) {
            state.token = value
        },
        setRole(state, value) {
            state.role = value
        },
        setNickname(state, value) {
            state.nickname = value
        },
        setMenuDefaultState(state, value) {
            let keys = value.split('-')
            state.defaultMenuOpen[0] = keys[0]
            state.defaultMenuSelected[0] = value
        },
        resetMenuState(state) {
            state.defaultMenuOpen[0] = '0'
            state.defaultMenuSelected[0] = '0-1'
        },
        setMenus(state, value) {
            state.menus = value
        },
        setRoutes(state, value){
            state.routes = value
        }
    },
    actions: {},
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})
