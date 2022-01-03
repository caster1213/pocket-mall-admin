<template>
  <div v-if="type === 'streak'"
       :class="{'title-box':true, 'title-box-large':size === 'large','title-box-min':size === 'min'}">
    <div class="content">
      <span>{{ title }}</span>
      <slot name="right"></slot>
    </div>
  </div>
  <div v-else-if="type === 'left'" class="title-left" :class="{'title-bg-color':isColor}">
    <div>{{ title }}</div>
  </div>
  <div v-else class="title-line">
    <div>{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: String,
    isColor: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'streak'
    },
    size: {
      type: String,
      default: 'large'
    }
  }
}
</script>

<style lang="less" scoped>
.title-box {
  background-color: #f8f8f8;
  width: 100%;
}

.title-box-large {

  font-size: 14px;
  font-weight: 700;


  .content {
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }
}

.title-box-min {
  font-size: 12px;
  line-height: 30px;

  .content {
    padding: 1px 10px;
    display: flex;
    justify-content: space-between;
  }
}

.title-line {
  font-size: 14px;
  font-weight: 700;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebedf0;
}

.title-left {
  display: inline-block;
  border-left: 4px solid #155bd4;
  padding: 0 10px;
  margin: 5px 0;
  font-size: 14px;
  color: #323233;
}

.title-bg-color {
  background-color: #f8f8f8;
  width: 100%;
}
</style>
