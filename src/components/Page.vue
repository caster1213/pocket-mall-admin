<template>
  <div class="p-container">
    <a-spin :delay="500" :spinning="loading">
      <slot></slot>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: {
    loading: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/css/page-box.css";
</style>
