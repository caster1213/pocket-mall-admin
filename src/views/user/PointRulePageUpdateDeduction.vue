<template>
  <a-modal :visible="visible" @cancel="onCancel" @ok="onSubmit" title="积分抵现">
    <a-checkbox :checked="selected" @change="selected = !selected">积分抵现</a-checkbox>
    <div class="p-box p-box-bg-gary1 mt10">
      <a-form-model :label-col="{span:5}" :wrapper-col="{span:15}">
        <a-form-model-item label="订单金额门槛">
          <a-radio-group v-model="form.isLimit" :disabled="selected === false" class="radio-list"
                         style="margin-top: 8px">
            <a-radio :value="true">
              <span>不限制</span>
            </a-radio>
            <a-radio :value="false">
              <span class="mr5">订单金额最低为</span>
              <a-input v-model="form.minValue" :disabled="selected === false" style="width: 80px"/>
              <span class="ml5">元时可抵现</span>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="抵现金额上限">
          <a-radio-group v-model="form.isMaxLimit" :disabled="selected === false" class="radio-list"
                         style="margin-top: 8px">
            <a-radio :value="true">
              <span>不限制</span>
            </a-radio>
            <a-radio :value="false">
              <span class="mr5">每笔订单金额最多抵扣</span>
              <a-input v-model="form.maxValue" :disabled="selected === false" style="width: 80px"/>
              <span class="ml5">元</span>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
import PointService from '../../service/point.service'
import common from "../../common/common"
import constant from "../../common/constant"

export default {
  name: "PointRulePageUpdateDeduction",
  props: {
    visible: Boolean,
    isOpen: Boolean,
    isMin: Boolean,
    isMax: Boolean,
    min: Number,
    max: Number
  },
  data() {
    return {
      selected: this.isOpen,
      loading: false,
      form: {
        isLimit: this.isMin,
        isMaxLimit: this.isMax,
        minValue: this.isMin ? '' : this.min,
        maxValue: this.isMax ? '' : this.max
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onSubmit() {
      this.loading = true
      let args = {
        isOpen: this.selected,
        isMin: this.form.isLimit,
        isMax: this.form.isMaxLimit
      }
      if (args.isMin === false) {
        args.minValue = this.form.minValue
      }
      if (args.isMax === false) {
        args.maxValue = this.form.maxValue
      }
      PointService.updateCommonRule({
        key: constant.pointCommonRule.pointDeduction,
        value: args
      }).then(res => {
        if (common.isSuccess(res)) {
          this.$emit('ok')
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