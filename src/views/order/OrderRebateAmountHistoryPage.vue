<template>
  <page :loading="loading">
    <div class="rebate-count-container">
      <div>
        <span class="label">退款总金额：</span>
        <span class="amount">{{ total.toDecimalString() }}</span>
      </div>
      <div class="right">
        <span>订单编号：</span>
        <a>{{ orderNumber }}</a>
      </div>
    </div>
    <a-table row-key="id" :pagination="false" :columns="columns" :data-source="dataSource"/>
    <a-modal :footer="null" @cancel="stepModelDialog = false" :visible="stepModelDialog" title="退款进度">
      <a-table row-key="id" :columns="saleAwardColumns" :data-source="saleAwardDataSource"
               :pagination="false"></a-table>
    </a-modal>
  </page>
</template>

<script>
import Page from '../../components/Page'
import OrderService from '../../service/order.service'

export default {
  name: "OrderRebateAmountHistoryPage",
  components: {
    Page
  },
  data() {
    return {
      loading: false,
      orderNumber: '',
      total: 0,
      dataSource: [],
      stepModelDialog: false,
      saleAwardDataSource: [],
      saleAwardColumns: [{
        title: '姓名',
        dataIndex: 'nickname',
        customRender: (value, row) => {
          let q = {
            path: '/users/detail',
            query: {
              uid: row.id
            }
          }
          return <router-link to={q}>{value}</router-link>
        }
      }, {
        title: '电话',
        dataIndex: 'phone'
      }, {
        title: '金额',
        dataIndex: 'amount',
        customRender: (amount) => {
          return amount.toDecimalString()
        }
      }, {
        title: '返利',
        dataIndex: 'level',
        customRender: (value) => {
          if (value === 1) {
            return '一级返利'
          } else {
            return '二级返利'
          }
        }
      }],
      columns: [{
        title: '退款单号',
        dataIndex: 'rebateTxNumber'
      }, {
        title: '申请时间',
        dataIndex: 'createDate'
      }, {
        title: '退款方式',
        customRender() {
          return '到余额'
        }
      }, {
        title: '金额（元）',
        dataIndex: 'amount',
        customRender(value) {
          return value.toDecimalString()
        },
      }, {
        title: '状态',
        customRender: (val, row) => {
          return <a onClick={() => {
            this.openStepDialog(row.rebateTxNumber)
          }}>退款成功</a>
        },
      }, {
        title: '操作人',
        dataIndex: 'operatorName'
      }, {
        title: '退款原因',
        dataIndex: 'reason'
      }]
    }
  },
  created() {
    this.orderNumber = this.$route.query.orderNumber
    this.loading = true
    this.load()
  },
  methods: {
    load() {
      OrderService.getRebateAmountList({orderNumber: this.orderNumber}).then(res => {
        this.loading = false
        this.total = res.data.result.totalAmount
        this.dataSource = [...res.data.result.list]
      })
    },
    openStepDialog(tx) {
      OrderService.getRebateSaleList({
        tx: tx
      }).then(res => {
        this.stepModelDialog = true
        this.saleAwardDataSource = res.data.result
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rebate-count-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px 10px;

  .label {
    font-size: 18px;
    font-weight: bold;
  }

  .amount {
    color: red;
    font-weight: bold;
    font-size: 18px;
  }

  .right {
    font-size: 16px;
  }
}

.table-log-container {

}
</style>