<template>
  <div class="activity-type-card">
    <div class="activity-type-card-container">
      <div class="activity-type-card-title">{{ title }}</div>
      <div class="activity-type-card-desc">{{ desc }}</div>
      <div v-if="isEmpty === false" class="activity-type-card-button">
        <a-button type="primary" @click="$emit('click')">立即新建</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityTypeCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    isEmpty: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="less" scoped>
.activity-type-card {
  background-color: rgba(51, 136, 255, .07);
  padding: 20px 27px 17px 27px;
  margin-right: 15px;
  flex: 1;

  .activity-type-card-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .activity-type-card-title {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .activity-type-card-desc {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
  }
}
</style>
