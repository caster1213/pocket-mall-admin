<template>
    <a-checkbox-group v-model="limitSelect" style="margin-top: 8px">
        <a-checkbox value="count" style="max-height: 120px">
            <span>限制每人可购买数量</span>
            <div v-if="isShowLimitCount" class="ml20 mt5">
                <a-radio-group v-model="isLifelongLimit" class="radio-list">
                    <a-radio :value="true">
                        <span>终身限购</span>
                        <a-input @change="onValue1Change" v-model="value1" class="ml15" addon-after="件"
                                 style="width: 110px;" />
                    </a-radio>
                    <a-radio :value="false">
                        <span class="mr5">按周期购买</span>
                        <a-select v-model="uint" default-value="DAY" style="width: 70px">
                            <a-select-option value="DAY">每天</a-select-option>
                            <a-select-option value="WEEK">每周</a-select-option>
                            <a-select-option value="MONTH">每月</a-select-option>
                        </a-select>
                        <a-input @change="onValue2Change" v-model="value2" class="ml5" addon-after="件"
                                 style="width: 110px;" />
                    </a-radio>
                </a-radio-group>
                <div style="color: #f5222d;font-size: 12px" v-show="hasError">请输入正确的限购件数</div>
            </div>
        </a-checkbox>
        <a-checkbox value="identity" style="display: block;margin-left: 0;margin-top: 5px">
            <span>只允许特定用户购买</span>
            <div v-if="isShowLimitIdentity" style="margin-left: 22px;margin-top: 10px;">
                <div class="mb10">选择会员身份</div>
                <a-select mode="multiple" v-model="levels" style="max-width: 350px">
                    <a-select-option v-for="ele in memberLevels" :key="ele.id" :value="ele.id">
                        {{ele.name}}
                    </a-select-option>
                </a-select>
            </div>
        </a-checkbox>
    </a-checkbox-group>
</template>

<script>
import UserVipLevelService from '../../service/user.level.service'
import pattern from '../../common/pattern';

export default {
  name: 'UpdateProductLimit',
  model: {
    prop: 'limit',
    event: 'input'
  },
  props: {
    limit: Object
  },
  data() {
    return {
      memberLevels: [],
      limitSelect: [],
      isLifelongLimit: false,
      levels: [],
      value1: '',
      value2: '',
      hasError: false,
      uint: ''
    }
  },
  computed: {
    isShowLimitCount() {
      return this.limitSelect.indexOf('count') > -1
    },
    isShowLimitIdentity() {
      return this.limitSelect.indexOf('identity') > -1
    }
  },
  created() {
    UserVipLevelService.list().then(res => {
      this.memberLevels = res.data.result
      this.init()
    })
  },
  methods: {
    init() {
      if (this.limit.isLimitIdentity) {
        this.limitSelect.push('identity')
      }
      if (this.limit.isLimitCount) {
        this.limitSelect.push('count')
      }
      this.isLifelongLimit = this.limit.isLifelongLimit
      this.uint = this.limit.cycleUnit
      this.levels = this.limit.levels.map(x => parseInt(x))
      if (this.limitSelect.indexOf('count') === -1) {
        this.isLifelongLimit = true
      }
      if (this.isLifelongLimit) {
        this.value1 = this.limit.limitCount === 0 ? '' : this.limit.limitCount
      } else {
        this.value2 = this.limit.limitCount === 0 ? '' : this.limit.limitCount
      }
    },
    getFields() {
      let obj = {
        isLimitIdentity: this.limitSelect.indexOf('identity') > -1,
        isLimitCount: this.limitSelect.indexOf('count') > -1,
        isLifelongLimit: this.isLifelongLimit,
        limitCount: this.isLifelongLimit ? this.value1 : this.value2,
        cycleUnit: this.uint,
        levels: [...this.levels]
      }
      return obj
    },
    validate() {
      if (this.limitSelect.length === 0){
        this.$emit('input', {
          isLimitIdentity: false,
          isLimitCount: true,
          isLifelongLimit: false,
          limitCount: 1,
          cycleUnit: 'DAY',
          levels: []
        })
        return true
      }
      if (this.isLifelongLimit) {
        if (this.value1.length === 0 || this.value1 === '0') {
          this.hasError = true
          return false
        }
      } else {
        if (this.value2.length === 0 || this.value2 === '0') {
          this.hasError = true
          return false
        }
      }
      this.$emit('input', this.getFields())
      return true
    },

    onValue1Change() {
      this.value1 = this.validateNumber(this.value1)
    },
    onValue2Change() {
      this.value2 = this.validateNumber(this.value2)
    },
    validateNumber(value) {
      if (pattern.decimal0.test(value) === false) {
        return value.substring(0, value.length - 1)
      } else {
        return value
      }
    }
  }
}
</script>

<style scoped>

</style>
