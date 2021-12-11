<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <div class="query">
                    <a-row class="bottom" type="flex" align="middle" justify="start">
                        <a-col span="2">产生日期</a-col>
                        <a-range-picker :allow-clear="true" v-model="filterOption.dataRange" />
                    </a-row>
                    <a-row class="bottom" type="flex" align="middle" justify="start">
                        <a-col offset="2">
                            <a-button @click="onClickQuery" class="p-input-right" type="primary" :loading="loading">查询
                            </a-button>
                            <a-button @click="onExport">导出</a-button>
                        </a-col>
                    </a-row>
                    <a-row type="flex" align="middle" justify="start">
                        <a-col offset="2">
                            <a-row type="flex" align="middle">
                                <span style="margin-right: 20px" class="result">查询结果合计</span>
                                <div class="result">
                                    <span>微信支付</span>
                                    <span class="total">{{getWeiXinPayTotal}}元</span>
                                </div>
                                <div class="result">
                                    <span>支付宝</span>
                                    <span class="total">{{getAliPayTotal}}元</span>
                                </div>
                                <div class="result">
                                    <span>云闪付</span>
                                    <span class="total">{{getCloudPayTotal}}元</span>
                                </div>
                                <div class="result">
                                    <span>积分支付</span>
                                    <span class="total">{{getPointPayTotal}}元</span>
                                </div>
                                <div class="result">
                                    <span>余额支付</span>
                                    <span class="total">{{getBalancePayTotal}}元</span>
                                </div>
                            </a-row>
                        </a-col>
                    </a-row>
                </div>
            </div>
            <div class="p-box p-box-bg-white">
                <a-table row-key="id" :columns="columns" :data-source="goodsCostList" :pagination="false"
                         :loading="loading"></a-table>
            </div>
        </div>
        <p-footer-page @nextPage="onChangePage" @nextPageSize="onChangePage" :page-index="pageOptions.pageIndex"
                       :page-total="pageOptions.pageTotal" />
    </div>
</template>

<script>
import ReportService from '../../service/report.service'
import ExportService from '../../service/export.service'
import moment from 'moment'

export default {
  name: 'DailyPaymentCount',
  data() {
    return {
      columns: [{
        title: '日期',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD')
        },
      }, {
        title: '微信支付',
        dataIndex: 'weiXinPay',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '云闪付',
        dataIndex: 'cloudPay',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '支付宝',
        dataIndex: 'aliPay',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '积分',
        dataIndex: 'pointPay',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '余额',
        dataIndex: 'balancePay',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '合计',
        customRender(value, row) {
          return (row.weiXinPay + row.aliPay + row.cloudPay + row.pointPay + row.balancePay).toDecimalString()
        }
      }],
      pageOptions: {
        pageIndex: 1,
        pageTotal: 0,
        pageSize: 25
      },
      goodsCostList: [],
      weiXinPayTotal: 0,
      aliPayTotal: 0,
      cloudPayTotal: 0,
      pointPayTotal: 0,
      balancePayTotal: 0,
      totalCostAmount: 0,
      loading: false,
      filterOption: {
        dataRange: []
      }
    }
  },
  computed: {
    getWeiXinPayTotal() {
      return this.weiXinPayTotal.toDecimalString()
    },
    getAliPayTotal() {
      return this.aliPayTotal.toDecimalString()
    },
    getPointPayTotal() {
      return this.pointPayTotal.toDecimalString()
    },
    getCloudPayTotal() {
      return this.cloudPayTotal.toDecimalString()
    },
    getBalancePayTotal() {
      return this.balancePayTotal.toDecimalString()
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    getFilterOption() {
      let req = {
        pageIndex: this.pageOptions.pageIndex,
        pageSize: this.pageOptions.pageSize
      }
      if (this.filterOption.dataRange.length > 0) {
        req.startDate = this.filterOption.dataRange[0].format('YYYY-MM-DD 00:00:00')
        req.endDate = this.filterOption.dataRange[1].format('YYYY-MM-DD 23:59:59')
      }
      return req
    },
    query() {
      this.loading = true
      ReportService.getDailyPaymentCount(this.getFilterOption()).then(res => {
        let data = res.data.result
        this.goodsCostList = data.list
        this.pageOptions.pageTotal = data.pageTotal
        this.weiXinPayTotal = data.weiXinPayTotal
        this.aliPayTotal = data.aliPayTotal
        this.cloudPayTotal = data.cloudPayTotal
        this.pointPayTotal = data.pointPayTotal
        this.balancePayTotal = data.balancePayTotal
        this.loading = false
      })
    },
    onClickQuery() {
      return this.query()
    },
    onChangePage(pageIndex, pageSize) {
      this.pageOptions.pageIndex = pageIndex
      this.pageOptions.pageSize = pageSize
      this.query()
    },
    onExport() {
      ExportService.exportDailyPayment(this.getFilterOption()).then(res => {
        this.$message.success('导出成功！请前往数据-下载中心进行查看')
      })

    }
  }
}
</script>

<style scoped>
    .query {
        margin-left: 30px;
    }

    .bottom {
        margin-bottom: 20px;
    }

    .result {
        font-weight: bold;
        font-size: 14px;
        color: #595961;
        margin-right: 10px;
    }

    .total {
        color: #FFB025;
        font-size: 18px;
        margin-left: 5px;
    }
</style>
