<template>
  <page>
    <div class="mb10" v-if="$route.query.hasOwnProperty('uid')">
      <span style="font-size: 14px">客户姓名：{{ nickname }}</span>
    </div>
    <div class="p-box p-box-bg-gary1">
      <a-form-model layout="inline">
        <a-form-model-item label="积分类型">
          <a-select v-model="queryForm.incomeOrExpense" style="width: 120px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="0">积分消耗</a-select-option>
            <a-select-option :value="1">积分发放</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="获得日期">
          <a-range-picker v-model="queryForm.selectDate" :show-time="true"/>
        </a-form-model-item>
        <a-form-model-item style="display: block" label="活动类型">
          <a-select v-model="queryForm.pointType" style="width: 120px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">签到有礼</a-select-option>
            <a-select-option :value="2">幸运抽奖</a-select-option>
            <a-select-option :value="3">多人拼团</a-select-option>
            <a-select-option :value="4">积分兑换</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-row class="mr10 mb20" type="flex">
        <div style="margin-left: 66px">
          <a-button @click="onFilter" type="primary">筛选</a-button>
          <a-button class="p-input-left-5">导出</a-button>
        </div>
      </a-row>
    </div>
    <div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="paginationConfig" :loading="loading"
               @change="onChangePage"
               row-key="id"/>
    </div>
  </page>
</template>

<script>
import Page from '../../components/Page'
import PointService from '../../service/point.service'
import {getPaginationConfig} from "../../common/field"


export default {
  name: "PointTxPage",
  components: {
    Page
  },
  data() {
    return {
      loading: false,
      queryForm: {
        incomeOrExpense: -1,
        pointType: -1,
        selectDate: []
      },
      columns: [{
        title: '客户',
        customRender: (val, row) => {
          return <div>
            <div>
              <a>{row.nickname}</a>
            </div>
            <div>{row.phone}</div>
          </div>
        }
      }, {
        title: '积分类型',
        dataIndex: 'incomeOrExpense',
        customRender: (val) => {
          if (val === 1) return '积分放发'
          else return '积分消耗'
        }
      }, {
        title: '积分活动',
        dataIndex: 'pointTypeDesc',
      }, {
        title: '日期',
        dataIndex: 'createDate'
      }, {
        title: '订单号',
        dataIndex: 'orderNumber',
        customRender(val) {
          if (val.length === 0) {
            return '-'
          } else {
            return val
          }
        }
      }, {
        title: '原因',
        dataIndex: 'remark'
      }, {
        title: '消耗明细',
        customRender: (value, row) => {
          if (value.incomeOrExpense === 1) {
            return <div style="color:green">
              <span>+</span>
              <span>{row.point}</span>
            </div>
          } else {
            return <div style="color:red">
              <span>-</span>
              <span>{row.point}</span>
            </div>
          }
        }
      }],
      dataSource: [],
      paginationConfig: getPaginationConfig()
    }
  },
  computed: {
    nickname() {
      if (this.dataSource.length > 0) {
        return this.dataSource[0].nickname
      }
      return '匿名用户'
    }
  },
  created() {
    this.load()
  },
  methods: {
    onChangePage(e) {
      this.paginationConfig.current = e.current
      this.paginationConfig.pageSize = e.pageSize
      this.load()
    },
    load() {
      let args = {
        pageIndex: this.paginationConfig.current,
        pageSize: this.paginationConfig.pageSize
      }
      if (this.queryForm.pointType !== -1) {
        args.pointType = this.queryForm.pointType
      }
      if (this.$route.query.hasOwnProperty('uid')) {
        args.userId = this.$route.query.uid
      }
      if (this.queryForm.incomeOrExpense !== -1) {
        args.incomeOrExpense = this.queryForm.incomeOrExpense
      }
      if (this.queryForm.selectDate.length > 0) {
        args.startDate = this.queryForm.selectDate[0].format('YYYY-MM-DD HH:mm:ss')
        args.endDate = this.queryForm.selectDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
      this.loading = true
      PointService.getPointTx(args).then(res => {
        this.loading = false
        this.paginationConfig.total = res.data.result.total
        this.dataSource = res.data.result.list
      })
    },
    onFilter() {
      this.paginationConfig.current = 1
      this.load()
    }
  }
}
</script>

<style scoped>

</style>
