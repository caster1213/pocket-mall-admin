<template>
  <div @click="onClick" class="target-box" :class="{'target-active':selected}">
    <a-row type="flex" justify="space-between">
      <div>
        <div class="name">
          <span class="font-size-13">{{ title }}</span>
        </div>
        <div class="target-value">
          {{ value }}
        </div>
        <div class="font-size-14">
          <span class="text-muted">较上一日</span>
          <span class="ml20">
            <span :style="{color:day>0?'red':'green'}">{{ getDayValue }}</span>
          </span>
        </div>
        <div class="font-size-14 ">
          <span class="text-muted">较上一周</span>
          <span style="position: relative" class="ml20">
            <span :style="{color:week>0?'red':'green'}">{{ getWeekValue }}</span>
          </span>
        </div>
      </div>
      <div style="margin-right: 15px">
        <a-checkbox :checked="selected"/>
      </div>
    </a-row>
  </div>
</template>

<script>


export default {
  name: "TargetPanel",
  props: {
    title: String,
    value: Number,
    day: Number,
    week: Number,
    targetKey: String,
    checked:Boolean
  },
  data() {
    return {
      selected: this.checked
    }
  },
  computed: {
    getDayValue() {
      if (this.day === 0) return '-'
      return this.day.toDecimalString() + "%"
    },
    getWeekValue() {
      if (this.week === 0) return '-'
      return this.week.toDecimalString() + "%"
    }
  },
  methods: {
    onClick() {
      this.selected = !this.selected
      this.$emit('change', {
        key: this.targetKey,
        name: this.title,
        selected:this.selected
      })
    }
  }
}
</script>

<style lang="less" scoped>
.target-box {
  cursor: pointer;
  padding: 16px;
  border: 1px solid #dcdee0;
  border-radius: 4px;
  margin-right: 8px;
  width: 220px;

  .name {
    font-size: 14px;
  }

  .target-value {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    margin-top: 4px;
  }
}

.target-active {
  border: 1px solid #155bd4;
  background-color: #edf4ff;
}
</style>