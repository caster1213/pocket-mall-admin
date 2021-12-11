<template>
  <a-row style="margin-left: 23px">
    <a-radio-group v-model="selectValue">
      <a-radio :value="true" style="display: block;margin-bottom: 5px">
        <span>每天重复</span>
        <div v-show="selectValue ===true">
          <a-row v-for="(row,index) in selectHours" :key="index"
                 style="padding-top: 10px;margin-left: 23px">
            <a-time-picker :class="{'error-active':row.isError}" v-model="row.start"
                           :default-open-value="moment('00:00', 'HH:mm')"
                           @change="onChangeSelectHours"
                           class="font-size-12 p-input-right"
                           format="HH:mm"/>
            <span>至</span>
            <a-time-picker :class="{'error-active':row.isError}" v-model="row.end"
                           :default-open-value="moment('00:00', 'HH:mm')"
                           :disabled-hours="()=>{return row.disabledHours}"
                           @change="onChangeSelectHours"
                           class="font-size-12 p-input-left"
                           format="HH:mm"/>
            <a-popconfirm title="确认删除该时段嘛？" @confirm="onDeleteHour(index)">
              <a class="font-size-12 p-input-left p-input-right">删除</a>
            </a-popconfirm>
            <div v-if="row.isError" class="error">{{ row.text }}</div>
          </a-row>
          <a-row @click.stop="()=>{}" style="margin-top: 10px">
            <a @click.stop="onAppendHour" class="font-size-12">添加时间</a>
          </a-row>
          <span v-if="selectHours.length === 0"
                style="margin-top: 10px;margin-left: 23px; display: inline-block;color: red;"
                class="font-size-12">请至少设置一个时间段</span>
        </div>
      </a-radio>
      <a-radio :value="false" style="display: block;margin-bottom: 10px">
        <span>每周重复</span>
        <div v-show="selectValue ===false">
          <a-row style="margin-left: 23px;margin-top: 5px">
            <div style="display: inline-block;margin-left: 5px;" class="font-size-12">
              <a-checkbox-group v-model="selectWeek">
                <a-checkbox class="font-size-12" v-for="option in constants" :key="option.value"
                            :value="option.value">{{ option.label }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </a-row>
          <a-row v-for="(row,index) in selectWeekHours" :key="index"
                 style="padding-top: 10px;margin-left: 23px">
            <a-time-picker :class="{'error-active':row.isError}" v-model="row.start"
                           :default-open-value="moment('00:00', 'HH:mm')"
                           @change="onChangeSelectWeekHours"
                           class="font-size-12 p-input-right"
                           format="HH:mm"></a-time-picker>
            <span>至</span>
            <a-time-picker :class="{'error-active':row.isError}" v-model="row.end"
                           :default-open-value="moment('00:00', 'HH:mm')"
                           @change="onChangeSelectWeekHours"
                           class="font-size-12 p-input-left"
                           format="HH:mm"></a-time-picker>
            <a @click="onDeleteWeekHour(index)" class="font-size-12 p-input-left p-input-right">删除</a>
            <div v-if="row.isError" class="error">{{ row.text }}</div>
          </a-row>
          <a-row style="margin-top: 10px;margin-left: 23px">
            <a @click="onAppendWeekHour" class="font-size-12">添加时间</a>
          </a-row>
          <span v-if="selectWeekHours.length === 0 || selectWeek.length === 0"
                style="margin-top: 10px;margin-left: 23px; display: inline-block;color: red;"
                class="font-size-12">请至少设置一个时间段</span>
        </div>
      </a-radio>
    </a-radio-group>
  </a-row>
</template>

<script>
import moment from 'moment'
import constant from "../common/constant"
import SelectTimeOption from "./model/SelectTimeOption"

export default {
  name: "SelectTime",
  props: {
    value: Object,
    isRequestCompleted: Boolean
  },
  data() {
    return {
      moment: moment,
      selectValue: true,
      constants: constant.week.options,
      selectWeek: [1, 2, 3, 4, 5, 6, 7],
      selectHours: [],
      selectWeekHours: []
    }
  },
  watch: {
    'isRequestCompleted': {
      handler(value) {
        if (value === false) return
        this.selectValue = this.value.isDaily
        if (this.value.weeks.length > 0) {
          this.selectWeek = this.value.weeks
        }
        if (this.value.isDaily) {
          this.selectHours = this.value.times.map(time => {
            let option = new SelectTimeOption()
            option.start = moment(time[0], moment.HTML5_FMT.TIME)
            option.end = moment(time[1], moment.HTML5_FMT.TIME)
            return option
          })
        } else {
          this.selectWeekHours = this.value.times.map(time => {
            let option = new SelectTimeOption()
            option.start = moment(time[0], moment.HTML5_FMT.TIME)
            option.end = moment(time[1], moment.HTML5_FMT.TIME)
            return option
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    onAppendWeekHour() {
      if (this.checkSelectHours(this.selectWeekHours) === false) return
      this.selectWeekHours.push(new SelectTimeOption())
    },
    onDeleteWeekHour(index) {
      this.selectWeekHours.splice(index, 1)
      this.change()
    },
    onAppendHour() {
      if (this.checkSelectHours(this.selectHours) === false) return
      this.selectHours.push(new SelectTimeOption())
    },
    onDeleteHour(index) {
      this.selectHours.splice(index, 1)
      this.change()
    },
    isAfter(row) {
      if (row.start.isAfter(row.end)) {
        row.isError = true
        row.text = '结束时间必须大于开始时间'
        return true
      } else {
        row.isError = false
        return false
      }
    },
    isNull(row) {
      if (row.start === null || row.end === null) {
        row.isError = true
        row.text = '请填写时间段'
        return true
      } else {
        row.isError = false
        return false
      }
    },
    isEqual(row) {
      if (row.start.isSame(row.end)) {
        row.isError = true
        row.text = '时间冲突，请重新编辑'
        return true
      } else {
        row.isError = false
        return false
      }
    },
    isBetween(list, index) {
      if (list.length === 1) return false
      let current = list[index]
      for (let i = 0; i < list.length; i++) {
        if (i === index) continue
        let option = list[i]
        let eq1 = current.start.isBetween(option.start, option.end)
        let eq2 = current.end.isBetween(option.start, option.end)
        if (eq1 && eq2) {
          current.isError = true
          current.text = '时间冲突，请重新编辑'
          return true
        }
      }
      current.isError = false
      return false
    },
    onChangeSelectHours() {
      if (this.checkSelectHours(this.selectHours)) {
        this.change()
      }
    },
    onChangeSelectWeekHours() {
      if (this.checkSelectHours(this.selectWeekHours)) {
        this.change()
      }
    },
    checkSelectHours(list) {
      for (let i = 0; i < list.length; i++) {
        if (this.isNull(list[i])) {
          this.$emit('exception', true)
          return false
        }
        if (this.isEqual(list[i])) {
          this.$emit('exception', true)
          return false
        }
        if (this.isAfter(list[i])) {
          this.$emit('exception', true)
          return false
        }
        if (this.isBetween(list, i)) {
          this.$emit('exception', true)
          return false
        }
      }
      this.$emit('exception', false)
      return true
    },
    change() {
      let times = []
      let weeks = []
      if (this.selectValue) {
        times = this.selectHours.map(x => {
          return [x.start.format('HH:mm'), x.end.format('HH:mm')]
        })
      } else {
        times = this.selectWeekHours.map(x => {
          return [x.start.format('HH:mm'), x.end.format('HH:mm')]
        })
        weeks = this.selectWeek
      }
      this.$emit('input', {
        isDaily: this.selectValue,
        weeks: weeks,
        times: times
      })
    }
  }
}
</script>

<style scoped>
.checkbox-list label {
  display: block;
  margin-bottom: 10px;
  margin-left: 0;
}

.error {
  margin-top: 5px;
  color: red;
  font-size: 12px;
}

.error-active /deep/ .ant-time-picker-input {
  border-color: red;
  color: red;
}
</style>
