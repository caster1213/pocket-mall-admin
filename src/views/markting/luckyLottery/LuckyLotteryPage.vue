<template>
  <page>
    <a-row type="flex" justify="space-between">
      <a-button @click="$router.push('/marketing/lottery/add')" type="primary">创建活动</a-button>
      <a-row type="flex">
        <div class="mr15">
          <a-select style="width: 160px" default-value="-1">
            <a-select-option value="-1">全部状态</a-select-option>
            <a-select-option value="2">未开始</a-select-option>
            <a-select-option value="3">进行中</a-select-option>
            <a-select-option value="4">已结束</a-select-option>
          </a-select>
        </div>
        <a-input-search @search="onSearch" style="width: 150px" placeholder="搜索活动名称"/>
      </a-row>
    </a-row>
    <div class="mt20">
      <a-table row-key="id" :columns="columns" :data-source="dataSource" :pagination="pagination"/>
    </div>
  </page>
</template>

<script>
import Page from '../../../components/Page'
import {PaginationConfig} from '../../../common/field'


export default {
  name: "LuckyLotteryPage",
  components: {
    Page
  },
  data() {
    return {
      loading: false,
      columns: [{
        title: '活动名称'
      }, {
        title: '活动日期'
      }, {
        title: '抽奖次数'
      },{
        title:'活动奖品'
      },{
        title: '活动状态'
      },{
        title: '抽奖人数'
      },{
        title:'中奖人数'
      },{
        title:'操作',
        customRender:()=>{
          return <div>
            <a-button className="text-action-btn" type="link">数据</a-button>
            <a-button className="text-action-btn" type="link">编辑</a-button>
            <a-button className="text-action-btn" type="link">删除</a-button>
          </div>
        }
      }],
      dataSource: [],
      pagination: new PaginationConfig()
    }
  },
  created() {
  },
  methods: {
    onSearch() {
      console.log(1)
    }
  }
}
</script>

<style scoped>

</style>