<template>
  <div class="user-level-select-picker-result">
    <div class="header">
      <div>
        <span>客户身份</span>
        <span class=" text-muted">(共3个)</span>
      </div>
      <span>操作</span>
    </div>
    <div class="list">
      <div class="item">
        <span>免费会员 / 全部免费会员</span>
        <a type="link" class="font-size-12">删除</a>
      </div>
      <div class="item">
        <span>免费会员 / 全部免费会员</span>
        <a type="link" class="font-size-12">删除</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLevelSelectPickerResult"
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
