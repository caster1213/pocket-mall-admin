<template>
  <a-result
    status="500"
    title="500"
    subTitle="服务器发生了错误。"
  >
    <template v-slot:extra>
      <a-button @click="toHome" type="primary">返回首页</a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Error',
  methods: {
    toHome () {
      this.$router.push('/').then()
    }
  }
}
</script>

<style scoped>

</style>
