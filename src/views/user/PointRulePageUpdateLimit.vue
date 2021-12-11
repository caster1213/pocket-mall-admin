<template>
  <a-modal :visible="visible" @cancel="onCancel" :loading="loading" @ok="onOk" title="消费获取的积分上限">
    <a-checkbox :checked="selected" @change="selected = !selected">每个客户每天通过消费最多获取</a-checkbox>
    <div style="display: inline-block">
      <a-input v-model="value" :disabled="selected === false" style="width: 60px"/>
      <span class="ml5">积分</span>
    </div>
  </a-modal>
</template>

<script>
import PointService from "../../service/point.service";
import constant from "../../common/constant";
import common from "../../common/common";

export default {
  name: "PointRulePageUpdateLimit",
  props: {
    quantity: String,
    isOpen: Boolean,
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      selected: this.isOpen,
      value: this.quantity,
      isShow: this.visible
    }
  },
  watch: {
    visible() {
      this.selected = this.isOpen
      this.value = this.quantity
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onOk() {
      this.loading = true
      PointService.updateCommonRule({
        key: constant.pointCommonRule.pointDailyLimit,
        value: {
          isOpen: this.selected,
          value: this.value
        }
      }).then((res) => {
        if (common.isSuccess(res)) {
          this.$emit('ok', {
            isOpen: this.selected,
            value: this.value
          })
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>