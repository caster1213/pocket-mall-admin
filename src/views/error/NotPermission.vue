<template>
  <a-result
    status="403"
    title="403"
    subTitle="你没有此页面的访问权限。"
  >
    <template v-slot:extra>
      <a-button @click="toHome" type="primary">Back Home</a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'NotPermission',
  methods: {
    toHome () {
      this.$router.push('/').then()
    }
  }
}
</script>

<style scoped>

</style>
