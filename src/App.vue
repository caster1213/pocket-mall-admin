<template>
    <a-config-provider :locale="local">
        <div id="app">
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
export default {
  name: 'App',
  data() {
    return {
      local: zhCN
    }
  },
  created() {
    document.title = process.env.VUE_APP_SYS_NAME
  }
}
</script>
<style lang="less">
    body {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    #app {
        height: 100%;
    }

    .select-form {
        padding: 24px;
    }

    .select-form .ant-form-item {
        display: flex;
    }

    .select-form .ant-form-item-control-wrapper {
        flex: 1.1;
    }

    .components-form-demo-advanced-search .ant-form {
        max-width: none;
    }

    .components-form-demo-advanced-search .search-result-list {
        margin-top: 16px;
        border-radius: 6px;
        min-height: 200px;
        text-align: center;
    }

    #components-layout-main {
        height: 100%;
    }

    #components-layout-main .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color .3s;
    }

    #components-layout-main .trigger:hover {
        color: #1890ff;
    }

    #components-layout-main .logo {
        height: 32px;
        /*background: rgba(255, 255, 255, .2);*/
        margin: 16px;
        display: flex;
        justify-content: center;
    }

    .nav {
        padding-left: 24px;
        padding-top: 10px;
    }

    .drop-avatar {
        margin-left: 20px;
        padding-top: 20px;
        padding-bottom: 22px;
        color: rgba(0, 0, 0, .65)
    }

    .drop-avatar a:hover {
        color: rgba(0, 0, 0, .65)
    }

    ::selection {
        color: #fff;
        background: #57b382 !important;
    }

    ::-moz-selection {
        color: #fff;
        background: #57b382 !important;
    }
</style>
