<template>
    <div class="p-container">
        <div class="p-box p-box-bg-white">
            <a-row type="flex">
                <activity-type-card title="固定套餐" desc="套餐内所有商品打包销售，消费者需成套购买整个套餐。" :activity-type="1" @create="(e)=>{
                  this.$router.push({path:'/marketing/package/page/add',query:{
                    type:e
                  }})
                }" />
                <activity-type-card title="搭配套餐" desc="套餐内主商品必选，搭配商品任意选！选择后以优惠价格购买。" :activity-type="2" />
                <activity-type-card title="更多活动" desc="敬请期待" :activity-type="-1" :is-empty="true" />
            </a-row>
        </div>
        <div class="p-box p-box-bg-gary1">
            <a-form-model class="activity-filter-form" layout="inline">
                <a-form-model-item label="活动名称">
                    <a-input style="width: 160px" />
                </a-form-model-item>
                <a-form-model-item label="活动类型">
                    <a-select style="width: 160px">
                        <a-select-option value="-1">全部套餐类型</a-select-option>
                        <a-select-option value="1">固定套餐</a-select-option>
                        <a-select-option value="2">搭配套餐</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="活动状态">
                    <a-select style="width: 160px">
                        <a-select-option value="-1">全部状态</a-select-option>
                        <a-select-option value="1">未开始</a-select-option>
                        <a-select-option value="2">进行中</a-select-option>
                        <a-select-option value="3">已结束</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
            <a-row style="margin-bottom: 15px" type="flex">
                <a-button class="mr15" type="primary">筛选</a-button>
                <a-button>重置</a-button>
            </a-row>
        </div>
        <a-table row-key="id" :columns="columns" :data-source="dataSource" :pagination="pagination" />
    </div>
</template>

<script>
import ActivityTypeCard from '../../../components/ActivityTypeCard'
import {PaginationConfig} from '../../../common/field'


export default {
  name: 'PackageDiscountActivityPage',
  components: {
    ActivityTypeCard
  },
  data() {
    return {
      dataSource: [{
        id: 1,
        name: '测试1',
        type: '搭配套餐',
        count: '1件',
        status: '已结束',
        saleCount: '0',
        price: '0.00'
      }],
      pagination: new PaginationConfig(),
      columns: [{
        title: '活动名称',
        dataIndex: 'name'
      }, {
        title: '活动类型',
        dataIndex: 'type'
      },
        {
          title: '商品数量',
          dataIndex: 'count'
        },
        {
          title: '状态',
          dataIndex: 'status'
        }, {
          title: '套餐销量',
          dataIndex: 'saleCount'
        }, {
          title: '金额(元)',
          dataIndex: 'price'
        },
        {
          title: '操作',
          customRender: () => {
            return (
              <div>
                <a-button type="link" class="text-action-btn">编辑</a-button>
                <a-button type="link" class="text-action-btn">查看</a-button>
                <a-button type="link" class="text-action-btn">删除</a-button>
                <a-button type="link" class="text-action-btn">失效</a-button>
              </div>
            )
          }
        }]
    }
  }
}
</script>

<style scoped>

</style>
