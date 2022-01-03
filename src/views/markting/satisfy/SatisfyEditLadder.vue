<template>
  <div class="satisfy-edit-ladder">
    <a-form-model :label-col="{span:5}" :wrapper-col="{span:15}">
      <a-form-model-item label="优惠门槛" required>
        <span class="mr5">满</span>
        <a-input style="width: 120px" />
        <span class="ml5">元</span>
      </a-form-model-item>
      <a-form-model-item label="优惠内容" required>
        <a-radio-group class="radio-list">
          <a-radio value="1">
            <span class="mr5">减</span>
            <a-input style="width: 120px" />
            <span class="ml5">元</span>
          </a-radio>
          <a-radio value="2">
            <span class="mr5">打</span>
            <a-input style="width: 120px" />
            <span class="ml5">折</span>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'SatisfyEditLadder',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.satisfy-edit-ladder {
  margin-top: 20px;

  .satisfy-edit-ladder-item {
    display: flex;

    .label {
      .required {
        color: red;
      }
    }
  }
}
</style>
