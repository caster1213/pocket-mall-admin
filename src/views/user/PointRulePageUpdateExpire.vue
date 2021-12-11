<template>
  <a-modal :visible="visible" @cancel="onCancel" :confirm-loading="loading" @ok="onSubmit">
    <template #title>
      <span class="mr10">积分有效期</span>
      <a-popover>
        <a-icon type="question-circle"/>
        <template #content>
          <span>积分有效期规则仅适用于规则生效后发放的积分，不影响历史发放积分</span>
        </template>
      </a-popover>
    </template>
    <a-radio-group v-model="expireType" class="radio-list">
      <a-radio :value="1">永久生效</a-radio>
      <a-radio :value="2">
        <span class="mr5">从获得开始</span>
        <div class="ml5" style="display: inline-block">
          <a-date-picker v-model="selectDate" class="ml5" placeholder="请选择日期"/>
        </div>
      </a-radio>
      <a-radio class="inline" :value="3">
        <div style="display: flex;align-items: center">
          <span class="mr5">每笔积分有效期为</span>
          <a-input-group compact>
            <a-input v-model="selectValue" style="width: 100px"/>
            <a-select v-model="selectUnit" :default-value="1" style="width: 60px">
              <a-select-option :value="1">年</a-select-option>
              <a-select-option :value="2">月</a-select-option>
              <a-select-option :value="3">日</a-select-option>
            </a-select>
          </a-input-group>
          <a-popover>
            <a-icon class="ml10" type="question-circle"/>
            <template #content>
              <span>“年”支持 1-3 年，“月”支持 1-18 个月，“日”支持 1-365 日。</span>
            </template>
          </a-popover>
        </div>
      </a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script>
import PointService from '../../service/point.service'
import common from "../../common/common"
import constant from "../../common/constant"
import moment from "moment"

export default {
  name: "PointRulePageUpdateExpire",
  props: {
    visible: Boolean,
    type: Number,
    date: String,
    unit: Number,
    value: Number
  },
  data() {
    console.log(this.unit)
    return {
      loading: false,
      expireType: this.type,
      selectDate: this.date === '0001-01-01 00:00:00' ? '' : moment(this.date),
      selectValue: this.value === 0 ? '' : this.value,
      selectUnit: this.unit
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onSubmit() {
      this.loading = true
      let args = {
        key: constant.pointCommonRule.pointExpire,
        value: {
          expireType: this.expireType
        }
      }
      if (args.value.expireType === 2) {
        args.value.date = this.selectDate.format('YYYY-MM-DD HH:mm')
      }
      if (args.value.expireType === 3) {
        args.value.unit = this.selectUnit
        args.value.value = this.selectValue
      }
      PointService.updateCommonRule(args).then(res => {
        this.loading = false
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

<style lang="less" scoped>
.inline {
  /deep/ span:nth-child(2) {
    display: inline-block !important;
  }
}
</style>