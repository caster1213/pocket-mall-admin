<template>
    <a-layout id="components-layout-main">
        <a-layout-sider :trigger="null"
                        collapsible
                        breakpoint="lg"
                        width="130"
                        v-model="collapsed">
            <div class="logo">
                <img height="32" src="../assets/logo.png" />
            </div>
            <a-menu theme="dark"
                    mode="inline"
                    :defaultOpenKeys="defaultOpenKey"
                    :defaultSelectedKeys="defaultSelected">
                <a-menu-item @click="redirect"
                             key="0-1">
                    <span>概况</span>
                </a-menu-item>
                <a-sub-menu v-for="m in menus"
                            :key="m.key">
                    <span slot="title"><span>{{m.name}}</span></span>
                    <a-menu-item v-for="mm in m.children"
                                 @click="redirect"
                                 :key="mm.key">
                        {{mm.name}}
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-row type="flex"
                       justify="start">
                    <a-col style="height: 100%;"
                           span="24">
                        <a-row align="middle"
                               type="flex"
                               justify="end">
                            <a-col style="padding-right: 30px">
                                <a-dropdown overlayClassName="drop-position"
                                            placement="bottomRight"
                                            class="drop-avatar">
                                    <a href="#">
                                        <a-avatar :src="require('../assets/logo.png')"></a-avatar>
                                        {{$store.state.nickname}}
                                    </a>
                                    <a-menu slot="overlay">
                                        <a-menu-item @click="()=> this.updatePasswordVisible = true"
                                                     key="1">
                                            <a-icon :style="{fontSize:'14px'}" type="safety" />
                                            <span>修改密码</span>
                                        </a-menu-item>
                                        <a-menu-divider />
                                        <a-menu-item @click="logout"
                                                     key="3">
                                            <a-icon type="poweroff" />
                                            <span>退出登录</span>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout style="background:#fff;margin-top:2px; min-height: 45px; max-height: 45px">
                <a-breadcrumb :style="{ padding:'10px 0px 0px 24px'}">
                    <a-breadcrumb-item v-for="(item,index) in routes"
                                       :key="index">
                        <router-link :to="{path:item.path,query:item.query}">{{item.name}}</router-link>
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <!--          <div class="nav">
                                    <h2>{{selectedPage}}</h2>
                                  </div>-->
            </a-layout>
            <a-layout-content :style="{ margin: '24px 16px 0'}">
                <div :style="{ padding: '24px', background: '#fff'}">
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <!--  <a-layout-footer style="textAlign: center">
                      U.Smile ©2020 Created by U.Smile
                    </a-layout-footer>-->
        </a-layout>
        <a-modal title="修改密码"
                 :confirm-loading="loading"
                 :visible="updatePasswordVisible"
                 @cancel="()=> this.updatePasswordVisible = false"
                 @ok="changePassword">
            <a-form :form="updatePasswordForm">
                <a-form-item :labelCol="{span:4}"
                             :wrapperCol="{span:18}"
                             label="旧密码">
                    <a-input type="password"
                             placeholder="请输入旧密码"
                             v-decorator="['oldLoginPassword',{
           validateTrigger:['change','blur'],
                 rules:[
                   {
                     required:true,
                     whitespace:true,
                     message:'必须填写旧密码'
                   }]
        }]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{span:4}"
                             :wrapperCol="{span:18}"
                             label="新密码">
                    <a-input type="password"
                             placeholder="请输入新密码"
                             v-decorator="['loginPassword',{
           validateTrigger:['change','blur'],
                 rules:[
                   {
                     required:true,
                     whitespace:true,
                     message:'必须填写新密码'
                   }]
        }]"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-layout>
</template>

<script>
import EmployeeService from '../service/employee.service'

export default {
  data() {
    return {
      name:process.env.VUE_APP_SYS_NAME,
      collapsed: false,
      updatePasswordVisible: false,
      updatePasswordForm: this.$form.createForm(this),
      loading: false,
      routes: [],
      selectedPage: '查询',
      menus: []
    }
  },
  watch: {
    '$route': 'next'
  },
  computed: {
    defaultOpenKey() {
      return this.$store.state.defaultMenuOpen
    },
    defaultSelected() {
      return this.$store.state.defaultMenuSelected
    }
  },
  created() {
    let menus = this.$store.state.menus.filter(x => x.parentId === -1).map((value) => {
      if (value.parentId === -1) {
        return {
          key: value.id,
          name: value.name,
          children: []
        }
      }
    })
    menus.forEach(x => {
      let m = this.$store.state.menus.filter(f => f.parentId === x.key)
      m.forEach(c => {
        let routeTable = this.$router.options.routes[0].children
        let route = routeTable.find(x => x.meta.key === c.id)
        if (route === undefined) return
        if (route.meta.depth >= 2) return
        x.children.push({
          key: c.id,
          name: c.name,
          children: []
        })
      })
    })
    this.menus = menus
    this.routes = this.$store.state.routes
  },
  methods: {
    logout() {
      this.$store.commit('setToken', '')
      this.$store.commit('setRole', '')
      this.$store.commit('setRoutes', [])
      this.$router.push('/login').then()
    },
    redirect(event) {
      //this.$store.commit('setMenuDefaultState', event.key)
      if (event.key === '0-1') {
        this.$router.push('/dashboard').then()
      }
      let routes = this.$store.state.menus
      for (let index = 0; index <= routes.length - 1; index++) {
        /* if (routes[index].hasOwnProperty('meta') === false) continue
         if (routes[index].meta.hasOwnProperty('key') === false) continue*/
        if (routes[index].id === event.key) {
          let routes = this.$router.options.routes[0].children
          let route = routes.find(x=>x.meta.key === event.key)
          if (this.$route.meta.key ===route.meta.key) return
          this.$router.push(route.path).then()
        }
      }
    },
    changePassword() {
      this.updatePasswordForm.validateFields((error, value) => {
        if (error === null) {
          this.loading = true
          EmployeeService.passwordChanged(value).then(res => {
            this.loading = false
            if (res.data.code === 0) {
              this.updatePasswordVisible = false
              this.$message.success('修改成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    next() {
      if (this.$route.matched.length === 0) {
        this.$router.push('/error/404')
        return
      }
      if (this.$route.hasOwnProperty('meta')) {
        if (this.$route.meta.hasOwnProperty('depth')) {
          if (this.$route.meta.depth === 0) {
            if (this.routes.length > 1) this.routes.pop()
          }
          let index = this.routes.length - 1
          if (index > this.$route.meta.depth) {
            this.routes.pop()
          } else if (index < this.$route.meta.depth) {
            this.routes.push({
              path: this.$route.path,
              name: this.$route.meta.name,
              query: this.$route.query
            })
          } else {
            this.routes[index] = {
              path: this.$route.path,
              name: this.$route.meta.name,
              query: this.$route.query
            }
          }
        }
      }
      this.$store.commit('setRoutes',this.routes)
    }
  }
}
</script>
