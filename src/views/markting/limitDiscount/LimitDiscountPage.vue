<template>
  <page>
    <a-row type="flex" justify="space-between">
      <div>
        <a-button @click="$router.push('/marketing/limitdiscount/add')" type="primary">新建活动</a-button>
      </div>
      <div style="display: flex">
        <div class="mr15">
          <a-select style="width: 120px" :default-value="1">
            <a-select-option :value="1">全部状态</a-select-option>
          </a-select>
        </div>
        <a-input-search placeholder="请输入活动名称"/>
      </div>
    </a-row>
  </page>
</template>

<script>
import Page from '../../../components/Page'
export default {
  name: "LimitDiscountPage",
  components:{
    Page
  }
}
</script>

<style scoped>

</style>