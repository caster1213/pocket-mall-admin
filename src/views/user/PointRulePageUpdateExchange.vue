<template>
  <a-modal :visible="visible" @cancel="onCancel" :loading="loading" @ok="onOk" title="自定义积分兑换比例">
    <a-checkbox :checked="selected" @change="selected = !selected">积分兑换比例</a-checkbox>
    <div class="mt10">
      <a-input v-model="pointValue" :disabled="selected === false" style="width: 60px"/>
      <span class="ml5 mr5">积分等于</span>
      <a-input v-model="value" :disabled="selected === false" style="width: 60px"/>
      <span class="ml5">元</span>
    </div>
    <div class="mt10">
      <span class="text-muted font-size-13">
        例如：10积分等于1元，则客户每次使用的积分为10的整数倍
      </span>
    </div>
  </a-modal>
</template>

<script>
import PointService from '../../service/point.service'
import common from "../../common/common"
import constant from "../../common/constant"

export default {
  name: "PointRulePageUpdateExchange",
  props: {
    point: String,
    price: String,
    isOpen: Boolean,
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      selected: this.isOpen,
      pointValue: this.point,
      value: this.price,
      isShow: this.visible
    }
  },
  watch: {
    visible() {
      this.selected = this.isOpen
      this.value = this.price
      this.pointValue = this.point
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onOk() {
      this.loading = true
      PointService.updateCommonRule({
        key: constant.pointCommonRule.pointExchange,
        value: {
          isOpen: this.selected,
          price: this.value,
          point: this.pointValue
        }
      }).then((res) => {
        if (common.isSuccess(res)) {
          this.$emit('ok', {
            isOpen: this.selected,
            price: this.value,
            point: this.pointValue
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