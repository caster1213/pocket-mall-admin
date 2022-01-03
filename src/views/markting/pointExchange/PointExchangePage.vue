<template>
  <page>
    <a-row type="flex" justify="space-between">
      <div>
        <a-button @click="$router.push('/marketing/point/add')" type="primary">新建活动</a-button>
      </div>
      <div style="display: flex">
        <div class="mr15">
          <a-select style="width: 120px;" :default-value="1">
            <a-select-option :value="1">全部类型</a-select-option>
          </a-select>
        </div>
        <div class="mr15">
          <a-select v-model="filter.selectStatus" style="width: 120px" @change="load" :default-value="1">
            <a-select-option :value="-1">全部状态</a-select-option>
            <a-select-option :value="1">未开始</a-select-option>
            <a-select-option :value="2">进行中</a-select-option>
            <a-select-option :value="3">已结束</a-select-option>
          </a-select>
        </div>
        <a-input-search v-model="filter.selectProductName" @search="load" placeholder="请输入商品名称"/>
      </div>
    </a-row>
    <div class="mt20">
      <a-table row-key="id" :columns="columns" :data-source="dataSource" :loading="loading"  @change="onChange" :pagination="pagination"/>
    </div>
  </page>
</template>

<script>
import Page from '@/components/Page'
import {PaginationConfig} from '@/common/field'
import PointExchangeActivityService from '@/service/point.exchange.activity'
import constant from "@/common/constant"

export default {
  name: "PointExchangePage",
  components: {
    Page
  },
  data() {
    return {
      loading: false,
      filter: {
        selectStatus: -1,
        selectProductName: ''
      },
      columns: [{
        title: '活动商品',
        width: '350px',
        customRender: (value, row) => {
          let image = row.productImage.split(',')
          return <a-row type="flex" align="middle">
            <img width="60px" height="60px" src={image[0]}/>
            <div style="width:200px" class="ml10">
              <a class="line1">{row.productTitle}</a>
            </div>
          </a-row>
        }
      }, {
        title: '兑换价',
        customRender: (value, row) => {
          return <div>
            <span>{row.exchangePoint}积分</span>
            <span class="ml5 mr5">+</span>
            <span>{row.exchangePrice.toDecimalString()}元</span>
          </div>
        }
      }, {
        title: '已兑换/剩余',
        customRender: (value, row) => {
          return <span>{row.exchangeCount}/{row.count - row.exchangeCount}</span>
        }
      }, {
        title: '限兑数量',
        dataIndex: 'exchangeLimitCount',
        customRender: (value) => {
          if (value === -1) {
            return '不限制'
          } else {
            return value
          }
        }
      }, {
        title: '有效期',
        customRender: (value, row) => {
          return <div>
            <span>{row.startDate}</span>
            <span class="ml5 mr5">至</span>
            <span>{row.endDate}</span>
          </div>
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        customRender(value) {
          if (value === 1) {
            return '未开始'
          } else if (value === 2) {
            return '进行中'
          } else {
            return '已结束'
          }
        }
      }, {
        title: '操作',
        customRender: (value, row) => {
          let expireBtn = <span></span>
          if (row.status !== 3) {
            expireBtn = <a-popconfirm onConfirm={() => {
              this.onExpire(row.id)
            }} title="确认让活动失效？">
              <a-button class="text-action-btn" type="link">失效</a-button>
            </a-popconfirm>
          }
          return <div>
            <a-button onClick={() => {
              this.$router.push({path: '/marketing/point/add', query: {id: row.id}})
            }} class="text-action-btn" type="link">编辑
            </a-button>
            <a-popconfirm onConfirm={() => {
              this.onDelete(row.id)
            }} title="删除后不可恢复，确认删除？">
              <a-button class="text-action-btn" type="link">删除</a-button>
            </a-popconfirm>
            {expireBtn}
          </div>
        }
      }],
      dataSource: [],
      pagination: PaginationConfig
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      if (this.filter.selectStatus !== -1) {
        query.status = this.filter.selectStatus
      }
      if (this.filter.selectProductName.length > 0) {
        query.ProductTitle = this.filter.selectProductName
      }
      PointExchangeActivityService.list(query).then(res => {
        this.loading = false
        this.dataSource = res.data.result.list
        this.pagination.total = res.data.result.total
      })
    },
    onChange(e){
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.load();
    },
    onDelete(id) {
      PointExchangeActivityService.del({id: id}).then(res => {
        if (res.data.code === constant.serviceCode.success) {
          this.load()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onExpire(id) {
      PointExchangeActivityService.expire({id: id}).then(res => {
        if (res.data.code === constant.serviceCode.success) {
          this.load()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
