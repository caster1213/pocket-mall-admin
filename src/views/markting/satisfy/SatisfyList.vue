<template>
  <p-page>
    <div class="p-box p-box-bg-white">
      <a-row type="flex">
        <p-activity-type-card @click="$router.push('add')" title="满N元减" desc="满100元减10元" />
        <p-activity-type-card title="满N件赠X件" desc="满3件赠1件" />
        <p-activity-type-card title="更多满减/送" desc="敬请期待" :is-empty="true" />
      </a-row>
    </div>
    <div class="p-box p-box-bg-gary1">
      <a-form-model :model="query" class="activity-filter-form" layout="inline">
        <a-form-model-item label="活动名称">
          <a-input v-model="query.name" />
        </a-form-model-item>
        <a-form-model-item label="活动状态">
          <a-select v-model="query.status" style="width: 120px">
            <a-select-option :value="-1">全部状态</a-select-option>
            <a-select-option :value="1">未开始</a-select-option>
            <a-select-option :value="2">进行中</a-select-option>
            <a-select-option :value="3">已结束</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="活动类型">
          <a-select v-model="query.type" style="width: 120px">
            <a-select-option :value="-1">全部类型</a-select-option>
            <a-select-option :value="1">满N元减/送</a-select-option>
            <a-select-option :value="2">满N件减/送</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-row style="margin-bottom: 15px" type="flex">
        <a-button class="mr15" type="primary">筛选</a-button>
        <a-button>重置</a-button>
      </a-row>
    </div>
    <a-table row-key="id" :columns="columns" :data-source="dataSource" @change="onPageChange"
             :pagination="pagination" />
  </p-page>
</template>

<script>
import query from '@/mixin/query'

export default {
  name: 'List',
  mixins: [query],
  data() {
    return {
      columns: [{
        title: '活动名称'
      }, {
        title: '类型'
      }, {
        title: '优惠内容'
      }, {
        title: '状态'
      }, {
        title: '支付订单'
      }, {
        title: '支付金额'
      }, {
        title: '操作'
      }],
      dataSource: [],
      loading: false,
      query: {
        name: '',
        status: -1,
        type: -1
      }
    }
  }
}
</script>

<style scoped>

</style>
