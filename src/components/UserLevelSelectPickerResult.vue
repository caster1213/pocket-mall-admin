<template>
  <div class="user-level-select-picker-result">
    <div class="header">
      <div>
        <span>客户身份</span>
        <span class=" text-muted">(共{{ count }}个)</span>
      </div>
      <span>操作</span>
    </div>
    <div class="list">
      <div v-for="ele in free" :key="ele.level"  class="item">
        <span>免费会员 / {{ ele.name }}</span>
        <a @click="onChargeDelete(ele)" type="link" class="font-size-12">删除</a>
      </div>
      <div v-for="ele in charge" :key="ele.level" class="item">
        <span>付费会员 / {{ ele.name }}</span>
        <a @click="onChargeDelete(ele)" type="link" class="font-size-12">删除</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLevelSelectPickerResult",
  props: {
    free: {
      type: Array,
      default: () => {
        return []
      }
    },
    charge: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  computed: {
    count() {
      return this.free.length + this.charge.length
    }
  },
  methods: {
    onFreeDelete(level) {
      this.$emit('chargeDelete', level)
    },
    onChargeDelete(level) {
      this.$emit('chargeDelete', level)
    }
  }
}
</script>

<style lang="less" scoped>
.user-level-select-picker-result {
  min-width: 280px;
  border: 1px solid #e5e5e5;

  .header {
    background-color: #f8f8f8;
    padding: 5px 10px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .list {
    padding: 0 10px;
    font-size: 12px;

    .item {
      line-height: 30px;
      display: flex;
      justify-content: space-between;

      a {
        color: #155bd4;
      }
    }
  }
}
</style>
