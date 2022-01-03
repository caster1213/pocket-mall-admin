<template>
  <page :loading="loading">
    <a-row type="flex" align="middle">
      <h2 style="margin: 0">日历签到</h2>
      <span class="font-size-14 mr20 ml20">{{ openName }}</span>
      <a-button @click="onClick" type="link" class="text-action-btn font-size-14">{{ btnName }}</a-button>
    </a-row>
    <a-tabs v-model="tabSelectIndex">
      <a-tab-pane key="count" tab="签到统计">
        <sign-in-activity-count-page/>
      </a-tab-pane>
      <a-tab-pane key="setting" tab="签到设置">
        <sign-in-activity-rule-page/>
      </a-tab-pane>
      <a-tab-pane key="page" tab="签到页面"></a-tab-pane>
    </a-tabs>
  </page>
</template>

<script>
import Page from '@/components/Page'
import SignInActivityCountPage from "./SignInActivityCountPage"
import SignInActivityRulePage from "./SignInActivityRulePage"
import SignService from '@/service/sign.service'
import util from '@/common/common'

export default {
  name: "SignInActivityPage",
  components: {
    Page,
    SignInActivityCountPage,
    SignInActivityRulePage
  },
  data() {
    return {
      loading: false,
      tabSelectIndex: 'count',
      isOpen: false
    }
  },
  computed: {
    openName() {
      return this.isOpen ? "已启用" : "已停用"
    },
    btnName() {
      return this.isOpen ? "停用" : "启用"
    }
  },
  created() {
    SignService.get().then(res => {
      this.isOpen = res.data.result.value.isOpen
    })
  },
  methods: {
    onClick() {
      if (this.isOpen) {
        SignService.close().then(res => {
          if (util.isSuccess(res) === false) {
            this.$message.error(res.data.msg)
          } else {
            this.isOpen = false
          }
        })
      } else {
        SignService.open().then(res => {
          if (util.isSuccess(res) === false) {
            this.$message.error(res.data.msg)
          } else {
            this.isOpen = true
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
