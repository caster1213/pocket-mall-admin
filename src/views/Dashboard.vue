<template>
  <div>
    <a-row type="flex">
      <a-col>
        <a-card style="width:700px">
          <div style="margin-bottom:20px;font-weight:600">
            <span>今日数据</span>
          </div>
          <a-row type="flex">
            <a-col span="6">
              <a-statistic title="今日交易额"
                           :value="todayPayAmount" />
            </a-col>
            <a-col span="6">
              <a-statistic title="今日支付单数"
                           :value="todayOrderCount" />
            </a-col>
            <a-col span="6">
              <a-statistic title="今日总佣金"
                           :value="todayCommissionAmount" />
            </a-col>
            <a-col span="6">
              <a-statistic title="今日总提现"
                           :value="todayWtihdrawAmount" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col offset="1">
        <a-card style="width:500px">
          <a-row type="flex">
            <div style="margin-bottom:20px;font-weight:600">
              <span>待办事项</span>
            </div>
          </a-row>
          <a-row>
            <a-col span="6">
              <a-statistic title="待发货订单"
                           :value="orderDeliveryCount" />
            </a-col>
            <a-col span="6">
              <a-statistic title="提现审核"
                           :value="withdrawConfrimCount" />
            </a-col>
            <a-col span="6">
              <a-statistic title="实名审核"
                           :value="0" />
            </a-col>
            <a-col span="6">
              <a-statistic title="商品审核"
                           :value="0" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <!--<a-row>
      <a-card class="rank"
              title="商品概况">
        <a slot="extra"
           href="#">查看更多...</a>
        <a-list :bordered="false"
                :data-source="productRank">
          <div style="border:0px"
               slot="header">
            <div class="ant-spin-container">
              <ul class="ant-list-items">
                <li style="padding:0px"
                    class="ant-list-item">
                  <div style="font-weight:600">排名</div>
                  <div style="font-weight:600">商品</div>
                  <div style="font-weight:600">销量</div>
                  <div style="font-weight:600">成交金额</div>
                </li>
              </ul>
            </div>
          </div>
          <a-list-item style="border:0px"
                       slot="renderItem"
                       slot-scope="item,index">
            <div>{{index+1}}</div>
            <div>
              <img height="50"
                   src="http://m.360buyimg.com/mobilecms/s750x750_jfs/t8107/37/1359438185/72159/a6129e26/59b857f8N977f476c.jpg" />
              <span> {{item.name}}</span></div>
            <div>
              {{item.saleCount}}
            </div>
            <div>
              <a-statistic :value="item.saleAmount" />
            </div>
          </a-list-item>
        </a-list>
      </a-card>
    </a-row>-->
  </div>
</template>

<script>
import ReportService from '../service/report.service'

export default {
  name: 'Dashboard',
  data () {
    return {
      todayOrderCount: 0,
      todayPayAmount: 0,
      todayWtihdrawAmount: 0,
      todayCommissionAmount: 0,
      orderDeliveryCount: 0,
      withdrawConfrimCount: 0,
      rankColumns: [{
        title: '排名',
        dataIndex: 'id'
      }, {
        title: '商品',
        customRender () {
          return ''
        }
      }, {
        title: '销量',
        dataIndex: 'saleCount'
      }, {
        title: '销售金额',
        dataIndex: 'saleAmount'
      }],
      productRank: [{
        image: '',
        name: 'IPhone11 128内存 深空灰',
        saleCount: 1,
        saleAmount: 7872.22
      }, {
        image: '',
        name: 'IPhone11 128内存 深空灰',
        saleCount: 1,
        saleAmount: 7872.22
      }, {
        image: '',
        name: 'IPhone11 128内存 深空灰',
        saleCount: 1,
        saleAmount: 7872.22
      }]
    }
  },
  created () {
    ReportService.getDashboard().then(res => {
      this.todayOrderCount = res.data.result.field.dailyOrderCount
      this.todayPayAmount = res.data.result.field.dailyPayAmount
      this.todayCommissionAmount = res.data.result.field.dailyCommissionAmount
      this.todayWtihdrawAmount = res.data.result.field.dailyWithdrawAmount
      this.orderDeliveryCount = res.data.result.field.orderDeliveryCount
      this.withdrawConfrimCount = res.data.result.field.withdrawConfrimCount
    })
  },
  methods: {}
}
</script>

<style scoped>
.ant-list-split /deep/ .ant-list-header {
  border: 0px;
}
.ant-list-spli /deep/ .ant-list-header {
  border: 0px !important;
}
.rank {
  width: 700px;
  margin-top: 30px;
}
.rank /deep/ .ant-card-body {
  padding: 0px 24px 0px 24px;
}
.rank /deep/ .ant-statistic-content {
  font-size: 14px;
}
.rank /deep/ .ant-statistic-content-value-decimal {
  font-size: 10px;
}
</style>
