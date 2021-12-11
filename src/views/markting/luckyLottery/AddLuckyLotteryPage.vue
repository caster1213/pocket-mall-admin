<template>
  <page :loading="loading">
    <a-steps :current="stepCurrentIndex" type="navigation">
      <a-step title="创建活动"/>
      <a-step title="奖品设置"/>
      <a-step title="页面配置"/>
    </a-steps>
    <add-lucky-lottery-page-rule v-if="stepCurrentIndex === 0"/>
    <add-lucky-lottery-page-prize v-else-if="stepCurrentIndex === 1"/>
    <add-lucky-lottery-decorate v-else/>
    <p-footer>
      <template #content>
        <a-button v-if="stepCurrentIndex === 0">取消</a-button>
        <a-button @click="onLast()" v-if="stepCurrentIndex > 0">上一步</a-button>
        <a-button @click="onNext" class="ml15" type="primary">{{ nextBtnText }}</a-button>
      </template>
    </p-footer>
  </page>
</template>

<script>
import Page from "../../../components/Page"
import AddLuckyLotteryPageRule from "./AddLuckyLotteryPageRule"
import AddLuckyLotteryPagePrize from "./AddLuckyLotteryPagePrize"
import AddLuckyLotteryDecorate from "./AddLuckyLotteryPageDecorate"

export default {
  name: "AddLuckyLotteryPage",
  components: {
    Page,
    AddLuckyLotteryPageRule,
    AddLuckyLotteryPagePrize,
    AddLuckyLotteryDecorate
  },
  data() {
    return {
      loading: false,
      stepCurrentIndex: 0
    }
  },
  computed: {
    nextBtnText() {
      return this.stepCurrentIndex === 2 ? '完成' : '下一步';
    }
  },
  methods: {
    onNext() {
      this.stepCurrentIndex += 1
    },
    onLast() {
      this.stepCurrentIndex -= 1
    }
  }
}
</script>

<style scoped>

</style>