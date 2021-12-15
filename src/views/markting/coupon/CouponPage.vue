<template>
  <page :loading="loading">
    <div style="padding: 0" class="p-box p-box-bg-white">
      <a-row type="flex">
        <activity-type-card @click="$router.push({path:'/coupon/add',query:{type:couponType.reward}})"
                            title="满减券"
                            desc="例：满100元减20元"/>
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.discount}})" title="折扣券" desc="例：满100元打9折"/>
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.freight}})" title="运费券" desc="减免运费"/>
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.reduction}})" title="商品兑换券" desc="用于兑换指定商品"/>
      </a-row>
    </div>
    <div class="p-box p-box-bg-gary1">
      <a-form-model :model="query" class="activity-filter-form" layout="inline">
        <a-form-model-item label="优惠券名称">
          <a-input style="width: 160px" placeholder="请输入优惠券名称"/>
        </a-form-model-item>
        <a-form-model-item label="优惠券类型">
          <a-select v-model="query.couponType" style="width: 160px">
            <a-select-option :value="-1">全部优惠券</a-select-option>
            <a-select-option :value="1">满减券</a-select-option>
            <a-select-option :value="2">折扣券</a-select-option>
            <a-select-option :value="3">运费券</a-select-option>
            <a-select-option :value="4">商品兑换券</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="优惠券状态">
          <a-select v-model="query.couponState" style="width: 160px">
            <a-select-option :value="-1">全部状态</a-select-option>
            <a-select-option :value="1">未开始</a-select-option>
            <a-select-option :value="2">进行中</a-select-option>
            <a-select-option :value="3">已结束</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-row style="margin-bottom: 15px" type="flex">
        <a-button class="mr15" type="primary">筛选</a-button>
        <a-button>重置</a-button>
      </a-row>
    </div>
    <a-table row-key="id" :columns="columns" :data-source="dataSource" @change="onPageChange" :pagination="pagination"/>
  </page>
</template>

<script>
import Page from '@/components/Page'
import ActivityTypeCard from "@/components/ActivityTypeCard"
import query from '@/mixin/query'
import constant from "@/common/constant"

export default {
  name: 'CouponPage',
  components: {
    Page,
    ActivityTypeCard
  },
  mixins: [query],
  data() {
    return {
      loading: false,
      couponType: constant.couponType,
      query: {
        couponType: -1,
        couponState: -1
      },
      columns: [{
        title: '优惠券名称'
      }, {
        title: '名称备注'
      }, {
        title: '类型'
      }, {
        title: '优惠内容'
      }, {
        title: '状态'
      }, {
        title: '已领取'
      }, {
        title: '剩余'
      }, {
        title: '已使用'
      }, {
        title: '支付金额(元)'
      }, {
        title: '操作'
      }],
      dataSource: []
    }
  }
}
</script>

<style scoped>

</style>
