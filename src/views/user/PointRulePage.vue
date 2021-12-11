<template>
  <page :loading="loading">
    <div class="p-box p-box-bg-gary1">
      <a-row :class="{'counter-container':true}" type="flex">
        <a-col span="6">
          <a-statistic title="可用积分" :value="counter.availablePoint"/>
        </a-col>
        <a-col span="6">
          <a-statistic title="保护期内积分" :value="0"/>
        </a-col>
        <a-col span="6">
          <div class="ant-statistic">
            <div class="ant-statistic-title">累计发放积分</div>
            <div class="ant-statistic-content">
              <router-link tag="span" :to="{path:'/user/point/tx'}">
                     <span class="ant-statistic-content-value"><span
                         class="ant-statistic-content-value-int">
                       <a style="cursor: pointer;color: #155bd4">{{ counter.incomeTotalPoint }}</a>
                     </span></span>
              </router-link>
            </div>
          </div>
        </a-col>
        <a-col span="6">
          <div class="ant-statistic">
            <div class="ant-statistic-title">累计消耗积分</div>
            <div class="ant-statistic-content">
              <router-link tag="span" :to="{path:'/user/point/tx'}">
                     <span class="ant-statistic-content-value"><span
                         class="ant-statistic-content-value-int">
                       <a style="cursor: pointer;color: #155bd4">{{ counter.expenseTotalPoint }}</a>
                     </span></span>
              </router-link>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <nav-title title="设置通用积分规则"/>
    <div class="mt15 mb15">
      <a-table row-key="key" :columns="commonRuleColumns" :data-source="commonRules" :pagination="false"></a-table>
    </div>
    <nav-title title="自定义积分规则"/>
    <div class="mt15">
      <a-button @click="$router.push('/user/point/rule/add')" type="primary">新建积分规则</a-button>
      <a-table class="mt15" row-key="id" :columns="customRuleColumns" :data-source="customRuleDataSource"
               :pagination="customRulePagination"></a-table>
    </div>
    <point-rule-update-name @cancel="updatePointName.visible = false" @ok="()=>{
      this.updatePointName.visible = false
      this.load()
    }" :visible="updatePointName.visible" :name="updatePointName.value" :is-open="updatePointName.selected"/>
    <point-rule-update-limit @cancel="updatePointLimit.visible = false" @ok="()=>{
      this.updatePointLimit.visible = false
      this.load()
    }" :visible="updatePointLimit.visible"
                             :quantity="updatePointLimit.value" :is-open="updatePointLimit.selected"/>
    <point-rule-exchange @cancel="updatePointExchange.visible = false" @ok="()=>{
      this.updatePointExchange.visible = false
      this.load()
    }" :visible="updatePointExchange.visible"
                         :point="updatePointExchange.point"
                         :price="updatePointExchange.value" :is-open="updatePointExchange.selected"/>
    <point-rule-deduction v-if="updatePointDeduction.visible" @cancel="updatePointDeduction.visible = false" @ok="()=>{
      this.updatePointDeduction.visible = false
      this.load()
    }" :is-open="updatePointDeduction.selected"
                          :max="updatePointDeduction.max"
                          :min="updatePointDeduction.min"
                          :is-max="updatePointDeduction.isMax"
                          :is-min="updatePointDeduction.isMin"
                          :visible="updatePointDeduction.visible"/>
    <point-rule-expire v-if="updatePointExpire.visible" @cancel="updatePointExpire.visible = false" @ok="()=>{
      this.updatePointExpire.visible = false
      this.load()
    }" :visible="updatePointExpire.visible" :type="updatePointExpire.type" :date="updatePointExpire.date"
                       :unit="updatePointExpire.unit" :value="updatePointExpire.value"/>
  </page>
</template>

<script>
import Page from '../../components/Page'
import NavTitle from '../../components/Title'
import {PaginationConfig} from '../../common/field'
import PointService from '../../service/point.service'
import PointRuleUpdateName from "./PointRulePageUpdateName"
import PointRuleUpdateLimit from "./PointRulePageUpdateLimit"
import PointRuleExchange from "./PointRulePageUpdateExchange"
import PointRuleDeduction from "./PointRulePageUpdateDeduction"
import PointRuleExpire from "./PointRulePageUpdateExpire"
import constant from "../../common/constant"
import moment from "moment"

export default {
  name: "PointRulePage",
  components: {
    Page,
    NavTitle,
    PointRuleUpdateName,
    PointRuleUpdateLimit,
    PointRuleExchange,
    PointRuleDeduction,
    PointRuleExpire,
  },
  data() {
    return {
      loading: false,
      customNameDialogVisible: false,
      customExchangeRateDialogVisible: false,
      counter: {
        availablePoint: 0,
        incomeTotalPoint: 0,
        expenseTotalPoint: 0
      },
      updatePointName: {
        value: '',
        selected: false,
        visible: false
      },
      updatePointLimit: {
        value: '',
        selected: false,
        visible: false
      },
      updatePointExchange: {
        value: '',
        point: '',
        selected: false,
        visible: false
      },
      updatePointDeduction: {
        visible: false,
        selected: false,
        min: -1,
        isMin: true,
        max: -1,
        isMax: true,
      },
      updatePointExpire: {
        visible: false,
        type: 1,
        date: 0,
        unit: 0,
        value: 0
      },
      customRuleColumns: [{
        title: '规则名称',
        dataIndex: 'name'
      }, {
        title: '奖励条件',
        customRender: (value, row) => {
          let count = ''
          if (row.productRule === -1) {
            count = <span class="ml5 text-muted font-size-13">全部商品参加</span>
          } else {
            if (row.productRange === 1) {
              count = <span class="ml5 text-muted font-size-13">已有{row.range.length}个商品参加</span>
            } else {
              count = <span class="ml5 text-muted font-size-13">已有{row.range.length}个分组参加</span>
            }
          }
          if (row.ruleType === constant.pointCustomRuleType.saleAmountRate) {
            return (<div>
              <span>每销售金额{row.awardPoint}%</span>
              {count}
            </div>)
          } else {
            return (<div>
              <span>每购买金额{row.saleAmount}元</span>
              {count}
            </div>)
          }
        }
      }, {
        title: '奖励积分',
        dataIndex: 'awardPoint'
      }, {
        title: '规则更新时间',
        dataIndex: 'updateDate'
      }, {
        title: '已奖励总积分',
        dataIndex: 'awardTotal'
      }, {
        title: '状态',
        customRender() {
          return '生效中'
        }
      }, {
        title: '操作',
        customRender: (value) => {
          return <div>
            <a-button onClick={() => {
              this.$router.push({path: '/user/point/rule/add', query: {id: value.id}})
            }} type="link" class="text-action-btn">编辑
            </a-button>
            <a-button type="link" class="text-action-btn">删除</a-button>
          </div>
        }
      }],
      customRuleDataSource: [],
      customRulePagination: PaginationConfig,
      commonRuleColumns: [{
        title: '规则名称',
        dataIndex: 'name'
      }, {
        title: '规则详情',
        dataIndex: 'value',
        customRender: (value, row) => {
          if (row.key === 'Point.Expire') {
            if (value.expireType === 1) {
              return '永久有效'
            } else if (value.expireType === 2) {
              return <span>至 <span style="color:#f60">{moment(value.date).format('YYYY年MM月DD日')}</span></span>
            } else {
              let unitText = '年'
              if (value.unit === 2) {
                unitText = '月'
              }
              if (value.unit === 3) {
                unitText = '日'
              }
              return <span>每笔积分有效期为 <span style="color:#f60">{value.value}{unitText}</span></span>
            }
          }
          if (value.isOpen === false) {
            return '-'
          }
          if (row.key === constant.pointCommonRule.pointName) {
            return value.name
          }
          if (row.key === constant.pointCommonRule.pointDailyLimit) {
            return <div>
              <span>每个客户每天最多获取</span>
              <span class="ml5 mr5" style="color:#f60">{value.value}</span>
              <span>积分</span>
            </div>
          }
          if (row.key === constant.pointCommonRule.pointExchange) {
            return <div>
              <span class="mr5" style="color:#f60">{value.point}</span>
              <span>积分等于</span>
              <span class="ml5 mr5" style="color:#f60">{value.price}</span>
              <span>元</span>
            </div>
          }
          if (row.key === constant.pointCommonRule.pointDeduction) {
            let minElement = ''
            let maxElement = ''
            if (value.isMin) {
              minElement = <span class="ml5 mr5" style="color:#f60">不限制</span>
            } else {
              minElement = <span class="ml5 mr5" style="color:#f60">最低为{value.minValue}元</span>
            }
            if (value.isMax) {
              maxElement = <span class="ml5 mr5" style="color:#f60">不限制</span>
            } else {
              maxElement = <span class="ml5 mr5" style="color:#f60">最多抵扣{value.maxValue}元</span>
            }
            return <div>
              <span>订单金额门槛</span>
              {minElement}
              <span>抵现金额上限</span>
              {maxElement}
            </div>
          }
        }
      }, {
        title: '更新时间',
        dataIndex: 'updateDate',
        customRender: (value, row) => {
          if (row.value.isOpen) {
            return value
          } else {
            if (value === '0001-01-01 00:00:00') return '-'
            return value
          }
        }
      }, {
        title: '操作',
        customRender: (value, row) => {
          return <a-button type="link" onClick={() => {
            this.onOpenRuleDialog(row)
          }} class="text-action-btn">设置</a-button>
        }
      }],
      commonRules: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      PointService.getRuleData().then(res => {
        this.loading = false
        this.counter.availablePoint = res.data.result.availablePoint
        this.counter.incomeTotalPoint = res.data.result.incomeTotalPoint
        this.counter.expenseTotalPoint = res.data.result.expenseTotalPoint
        this.commonRules = res.data.result.rules
        this.customRuleDataSource = res.data.result.page.list
      })
    },
    onOpenRuleDialog(row) {
      if (row.key === constant.pointCommonRule.pointName) {
        this.updatePointName.visible = true
        this.updatePointName.value = row.value.name
        this.updatePointName.selected = row.value.isOpen
      }
      if (row.key === constant.pointCommonRule.pointDailyLimit) {
        this.updatePointLimit.visible = true
        this.updatePointLimit.value = row.value.value
        this.updatePointLimit.selected = row.value.isOpen
      }
      if (row.key === constant.pointCommonRule.pointExchange) {
        this.updatePointExchange.visible = true
        this.updatePointExchange.point = row.value.point
        this.updatePointExchange.value = row.value.price
        this.updatePointExchange.selected = row.value.isOpen
      }
      if (row.key === constant.pointCommonRule.pointDeduction) {
        this.updatePointDeduction.visible = true
        this.updatePointDeduction.selected = row.value.isOpen
        this.updatePointDeduction.min = row.value.minValue
        this.updatePointDeduction.max = row.value.maxValue
        this.updatePointDeduction.isMax = row.value.isMax
        this.updatePointDeduction.isMin = row.value.isMin
      }
      if (row.key === constant.pointCommonRule.pointExpire) {
        this.updatePointExpire.visible = true
        this.updatePointExpire.type = row.value.expireType
        this.updatePointExpire.date = row.value.date
        this.updatePointExpire.unit = row.value.unit
        this.updatePointExpire.value = row.value.value
      }
    }
  }
}
</script>

<style lang="less" scoped>
.counter-container {
  padding: 24px;

  /deep/ .ant-col {
    text-align: center;
  }
}
</style>