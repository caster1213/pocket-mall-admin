<template>
    <div class="login-container">
        <a-row>
            <a-col :span="12">
                <div class="login-header"></div>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <div class="login-body-container">
                    <div class="login-body-header">
                        <img class="logo" src="../assets/logo.png" />
                        <span class="logo-text">{{title}}后台系统</span>
                    </div>
                    <div class="login-body-input">
                        <a-tabs :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
                            <a-tab-pane tab="账号密码登录" key="1">
                                <a-form :form="form" @submit="login">
                                    <a-form-item>
                                        <a-input
                                                size="large"
                                                v-decorator="[
                            'loginName',
                            { rules:[{ required:true ,message:'请输入账号'}]}
                          ]"
                                                placeholder="管理员账号"
                                        >
                                            <a-icon
                                                    slot="prefix"
                                                    type="user"
                                                    style="color: rgba(0,0,0,.25)"
                                            />
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-input
                                                size="large"
                                                v-decorator="[
                          'loginPassword',
                          { rules: [ { required: true, message: '请输入密码' } ]}
                        ]"
                                                type="password"
                                                placeholder="管理员密码"
                                        >
                                            <a-icon
                                                    slot="prefix"
                                                    type="lock"
                                                    style="color: rgba(0,0,0,.25)"
                                            />
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-checkbox
                                                v-decorator="[
                        'remember',
                        {
                          valuePropName:'checked',
                          initialValue:true
                        }]"
                                        >
                                            自动登录
                                        </a-checkbox>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                                size="large"
                                                type="primary"
                                                html-type="submit"
                                                block
                                                :loading="loading"
                                                class="login-form-button"
                                        >
                                            登录
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import SecurityService from '../service/security.service'

export default {
  name: 'Login',
  data() {
    return {
      title: process.env.VUE_APP_SYS_NAME,
      loading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    login(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (error === null) {
          this.loading = true
          SecurityService.login(values)
            .then(rep => {
              if (rep.data.code === 0) {
                this.$store.commit('setNickname', rep.data.result.name)
                this.$store.commit('setToken', rep.data.result.accessToken)
                this.$store.commit('setRole', '')
                this.$store.commit('setMenus', rep.data.result.menus)
                this.$router.push('/')
              } else {
                this.loading = false
                this.$notification.warning({
                  message: '登录失败',
                  description: rep.data.msg,
                  duration: 2
                })
              }
            })
            .catch(err => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
    .login-header {
        height: 120px;
    }

    .login-container {
        background-size: 100%;
        background-color: #f0f2f5;
        background-image: url("../assets/login-background.svg");
        background-repeat: no-repeat;
        height: 100vh;
    }

    .login-body-container {
        padding-top: 20px;
        padding-bottom: 30px;
    }

    .login-body-header {
        text-align: center;
    }

    .login-body-input {
        padding-top: 30px;
        width: 365px;
        margin: auto;
    }

    .logo {
        height: 44px;
        margin-right: 16px;
        vertical-align: top;
    }

    .logo-text {
        height: 44px;
        line-height: 44px;
        color: rgba(0, 0, 0, .85);
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        font-size: 33px;
        font-weight: 500;
    }

    #components-form-demo-normal-login .login-form {
        max-width: 300px;
    }

    #components-form-demo-normal-login .login-form-forgot {
        float: right;
    }

    #components-form-demo-normal-login .login-form-button {
        width: 100%;
    }
</style>
