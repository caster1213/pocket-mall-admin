<template>
  <a-result
    status="404"
    title="404"
    subTitle="此页面未找到。"
  >
    <template v-slot:extra>
      <a-button @click="toHome" type="primary">Back Home</a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    toHome () {
      this.$router.push('/').then()
    }
  }
}
</script>

<style scoped>

</style>
