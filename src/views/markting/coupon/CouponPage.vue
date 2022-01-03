<template>
  <page :loading="loading">
    <div style="padding: 0" class="p-box p-box-bg-white">
      <a-row type="flex">
        <activity-type-card @click="$router.push({path:'/coupon/add',query:{type:couponType.reward}})"
                            title="满减券"
                            desc="例：满100元减20元" />
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.discount}})" title="折扣券"
                            desc="例：满100元打9折" />
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.freight}})" title="运费券"
                            desc="减免运费" />
        <activity-type-card @click="$router.push({path:'/coupon/update',query:{type:couponType.reduction}})"
                            title="商品兑换券" desc="用于兑换指定商品" />
      </a-row>
    </div>
    <div class="p-box p-box-bg-gary1">
      <a-form-model :model="query" class="activity-filter-form" layout="inline">
        <a-form-model-item label="优惠券名称">
          <a-input style="width: 160px" placeholder="请输入优惠券名称" />
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
    <a-table row-key="id" :columns="columns" :data-source="dataSource" @change="onPageChange"
             :pagination="pagination" />
  </page>
</template>

<script>
import Page from '@/components/Page'
import ActivityTypeCard from '@/components/ActivityTypeCard'
import query from '@/mixin/query'
import constant from '@/common/constant'
import {list as getCouponList} from '@/service/coupon.service'
import common from '@/common/common'

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
        title: '优惠券名称',
        dataIndex: 'name'
      }, {
        title: '名称备注',
        dataIndex: 'label',
        customRender: (value) => {
          if (value === null || value.length === 0) {
            return '-'
          }
          return value
        }
      }, {
        title: '类型',
        dataIndex: 'type',
        customRender(value) {
          if (value === constant.couponType.discount) {
            return '折扣卷'
          }
          if (value === constant.couponType.freight) {
            return '运费卷'
          }
          if (value === constant.couponType.reward) {
            return '满减卷'
          }
          return '立减劵'
        }
      }, {
        title: '优惠内容',
        customRender: (value, row) => {
          let sb = new common.TextExtend.StringBuilder()
          if (row.threshold === constant.couponThresholdType.orderCountMax) {
            sb.append(`满${row.maxOrderCountThreshold}件，`)
          }
          if (row.threshold === constant.couponThresholdType.orderPriceMax) {
            sb.append(`满${row.maxOrderPriceThreshold}元，`)
          }

          if (row.type === constant.couponType.reward) {
            sb.append(`减${row.discountAmount}`)
          }
          if (row.type === constant.couponType.discount) {
            sb.append(`打${row.discountAmount}折，`)
            if (row.maxDiscountAmount > 0) {
              sb.append(`最多减${row.maxDiscountAmount}元`)
            }
          }
          if (row.type === constant.couponType.freight) {
            sb.append(`运费减免${row.discountAmount}元`)
          }
          if (row.type === constant.couponType.reduction) {
            sb.append(`立减${row.discountAmount}元`)
          }

          return sb.toString()
        }
      }, {
        title: '状态'
      }, {
        title: '已领取',
        dataIndex: 'receiveCount'
      }, {
        title: '剩余',
        dataIndex: 'count',
        customRender: (value, row) => {
          return value - row.receiveCount
        }
      }, {
        title: '已使用',
        dataIndex: 'useCount'
      }, {
        title: '支付金额(元)',
        customRender() {
          return '0'
        }
      }, {
        title: '操作',
        customRender: (val, row) => {
          return (
              <div>
                <a-button onClick={() => {
                  this.$router.push({path: '/coupon/update', query: {id: row.id}})
                }} type="link" class="text-action-btn">编辑
                </a-button>
              </div>
          )
        }
      }],
      dataSource: []
    }
  }, created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      getCouponList({
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.dataSource = res.data.result.list
        this.pagination.total = res.data.result.total
      })
    }
  }
}
</script>

<style scoped>

</style>
