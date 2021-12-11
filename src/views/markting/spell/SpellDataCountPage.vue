<template>
  <page :loading="loading" class="p-box-bg-gary p-box">
    <div class="p-box p-box-bg-white newest-panel">
      <div class="title">
        <span class="mr5">实时概况</span>
        <a-popover>
          <template slot="content">
            <span>今日实时数据的统计时间均为今日零时截至当前更新时间</span>
          </template>
          <help theme="filled" size="14" fill="#C8C9CC"/>
        </a-popover>
      </div>
      <a-row type="flex">
        <a-col class="left" :span="11">
          <a-row type="flex" style="flex-direction: column">
            <div style="font-size: 14px">
              <span>中奖订单金额(元)</span>
            </div>
            <div>
              <span style="font-size: 20px;font-weight: 500;margin-right: 25px">{{ getTodayOrderAmount }}</span>
              <span style="font-size: 14px" class="text-muted mr5">昨日全天</span>
              <span style="font-size: 14px">{{ newest.orderHitAmount.yesterday.toDecimalString() }}</span>
            </div>
            <div id="newest-data-line"></div>
          </a-row>
        </a-col>
        <a-col :span="12" class="right">
          <a-row>
            <a-col :span="11" class="counter">
              <a-statistic title="今日参团人数" :value="newest.onlineCount.day"></a-statistic>
              <div class="mt15">
                <span class="text-muted size mr10">昨日全天</span>
                <span class="size">{{ newest.onlineCount.yesterday }}</span>
              </div>
            </a-col>
            <a-col :span="11" class="counter">
              <a-statistic title="中奖订单金额(元)" :value="newest.orderHitAmount.day.toDecimalString()"></a-statistic>
              <div class="mt15">
                <span class="text-muted size mr10">昨日全天</span>
                <span class="size">{{ newest.orderHitAmount.yesterday.toDecimalString() }}</span>
              </div>
            </a-col>
            <a-col :span="11" class="counter">
              <a-statistic title="现金奖励(元)" :value="newest.loseAward.day.toDecimalString()"></a-statistic>
              <div class="mt15">
                <span class="text-muted size mr10">昨日全天</span>
                <span class="size">{{ newest.loseAward.yesterday.toDecimalString() }}</span>
              </div>
            </a-col>
            <a-col :span="11" class="counter">
              <a-statistic title="积分奖励" :value="newest.pointAward.day"></a-statistic>
              <div class="mt15">
                <span class="text-muted size mr10">昨日全天</span>
                <span class="size">{{ newest.pointAward.yesterday }}</span>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="p-box p-box-bg-white core-target-panel">
      <a-row style="margin-bottom: 20px" type="flex" justify="space-between" align="middle">
        <div style="margin: 0" class="title">核心指标</div>
        <a-row type="flex" align="middle">
          <div class="mr20">
            <a-select style="width: 80px" default-value="1">
              <a-select-option value="1">自然日</a-select-option>
            </a-select>
          </div>
          <a-date-picker :disabled-date="disabledDate" v-model="date" @change="onChange" :show-today="false"/>
        </a-row>
      </a-row>
      <a-spin :spinning="targetLoading">
        <a-row type="flex">
          <target-panel @change="onTargetChange" target-key="orderWinPriceTarget"
                        :checked="true"
                        :value="target.orderWinPriceTarget.value"
                        :day="target.orderWinPriceTarget.day"
                        :week="target.orderWinPriceTarget.week" title="中奖订单金额(元)"/>
          <target-panel @change="onTargetChange" :checked="true" target-key="loseAwardAmountTarget"
                        :value="target.loseAwardAmountTarget.value"
                        :day="target.loseAwardAmountTarget.day"
                        :week="target.loseAwardAmountTarget.week" title="未中奖奖励金额(元)"/>
          <target-panel @change="onTargetChange" target-key="onlineTarget"
                        :value="target.onlineTarget.value"
                        :day="target.onlineTarget.day"
                        :week="target.onlineTarget.week" title="活跃人数"/>
          <target-panel @change="onTargetChange" target-key="pointAwardTarget" :value="target.pointAwardTarget.value"
                        :day="target.pointAwardTarget.day"
                        :week="target.pointAwardTarget.week" title="奖励放发积分"/>
          <target-panel @change="onTargetChange" target-key="orderWinCountTarget"
                        :value="target.orderWinCountTarget.value"
                        :day="target.orderWinCountTarget.day"
                        :week="target.orderWinCountTarget.week" title="中奖订单数量"/>
          <target-panel @change="onTargetChange" target-key="orderLoseCountTarget"
                        :value="target.orderLoseCountTarget.value"
                        :day="target.orderLoseCountTarget.day"
                        :week="target.orderLoseCountTarget.week" title="未拼中订单数量"/>
        </a-row>
        <div class="font-size-14 mt20">
          <span class="text-muted">已选择</span>
          <span class="ml5" style="color: #155bd4">{{ selectTarget.length }}</span>
          <span class="text-muted">/</span>
          <span style="color: #155bd4" class="mr5">4</span>
          <span class="text-muted">指个标</span>
        </div>
        <div class="target-line-data"></div>
      </a-spin>
    </div>
    <div class="p-box p-box-bg-white player-rank-panel">
      <div class="title">拼团实时排行榜</div>
      <a-row type="flex">
        <div class="rank-box">
          <div class="rank-box-name">中奖榜 TOP10</div>
          <a-table row-key="userId" :data-source="rank.orderWinRank" :pagination="false"
                   :columns="winPlayerRankColumns"/>
        </div>
        <div style="margin-left: 5%" class="rank-box">
          <div class="rank-box-name">未中榜 TOP10</div>
          <a-table row-key="userId" :data-source="rank.orderLoseRank" :pagination="false"
                   :columns="losePlayerRankColumns"/>
        </div>
        <div style="margin-left: 5%" class="rank-box">
          <div class="rank-box-name">佣金榜 TOP10</div>
          <a-table row-key="userId" :data-source="rank.orderPriceRank" :pagination="false"
                   :columns="awardPlayerRankColumns"/>
        </div>
      </a-row>
    </div>
  </page>
</template>

<script>
import Page from '../../../components/Page'
import {Help} from '@icon-park/vue'
import * as  echarts from 'echarts'
import TargetPanel from "../../../components/TargetPanel"
import ReportService from '../../../service/report.service'
import moment from "moment"


class TargetValue {
  constructor(value = 0, day = 0, week = 0) {
    this.value = value
    this.day = day
    this.week = week
  }
}

export default {
  name: "SpellDataCountPage",
  components: {
    Page,
    Help,
    TargetPanel
  },
  data() {
    return {
      loading: false,
      targetLoading: false,
      date: moment().subtract(1,"day"),
      rank: {
        orderWinRank: [],
        orderLoseRank: [],
        orderPriceRank: []
      },
      hour: {
        today: [],
        yesterday: []
      },
      newest: {
        onlineCount: {
          day: 0,
          yesterday: 0
        },
        orderHitAmount: {
          day: 0,
          yesterday: 0
        },
        loseAward: {
          day: 0,
          yesterday: 0
        },
        pointAward: {
          day: 0,
          yesterday: 0
        }
      },
      target: {
        orderWinPriceTarget: new TargetValue(),
        onlineTarget: new TargetValue(),
        loseAwardAmountTarget: new TargetValue(),
        pointAwardTarget: new TargetValue(),
        orderWinCountTarget: new TargetValue(),
        orderLoseCountTarget: new TargetValue()
      },
      first: {},
      last: {},
      targetLineChart: null,
      lineChart: null,
      targetLineData: [],
      selectTarget: [],
      lineChartOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            lineStyle: {
              type: "dashed"
            },
            alignWithLabel: true
          }
        },
        legend: {
          show: true,
          icon: 'circle',
          textStyle: {
            fontSize: 12
          },
          data: ['今日中奖订单金额', '昨日中奖订单金额'],
          formatter: function (value) {
            if (value === '今日中奖订单金额') return '今日'
            else return '昨日'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      targetChartOptions: {
        grid: {
          left: "80px"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            lineStyle: {
              type: "dashed"
            },
            alignWithLabel: true
          }
        },
        legend: {
          show: true,
          icon: 'circle',
          textStyle: {
            fontSize: 12
          },
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      winPlayerRankColumns: [
        {
          title: '排名',
          customRender: (value, row) => {
            return this.rank.orderWinRank.findIndex(ele => ele.userId === row.userId) + 1
          }
        },
        {
          title: '用户',
          customRender: (value, row) => {
            return <router-link to={{path: '/users/detail', query: {'uid': row.userId}}}>{row.nickname}</router-link>
          }
        },
        {
          title: '中奖次数',
          dataIndex: 'value'
        }
      ],
      losePlayerRankColumns: [
        {
          title: '排名',
          customRender: (value, row) => {
            return this.rank.orderLoseRank.findIndex(ele => ele.userId === row.userId) + 1
          }
        },
        {
          title: '用户',
          customRender: (value, row) => {
            return <router-link to={{path: '/users/detail', query: {'uid': row.userId}}}>{row.nickname}</router-link>
          }
        },
        {
          title: '未拼中次数',
          dataIndex: 'value'
        }
      ],
      awardPlayerRankColumns: [
        {
          title: '排名',
          customRender: (value, row) => {
            return this.rank.orderPriceRank.findIndex(ele => ele.userId === row.userId) + 1
          }
        },
        {
          title: '用户',
          customRender: (value, row) => {
            return <router-link to={{path: '/users/detail', query: {'uid': row.userId}}}>{row.nickname}</router-link>
          }
        },
        {
          title: '奖励金额',
          dataIndex: 'value',
          customRender(value) {
            return value.toDecimalString()
          }
        }
      ],
    }
  },
  computed: {
    getYesterdayAmount() {
      return this.hour.yesterday.reduce((prev, cur) => {
        return prev + cur.price
      }, 0).toDecimalString()
    },
    getTodayOrderAmount() {
      return this.hour.today.reduce((prev, cur) => {
        return prev + cur.price
      }, 0).toDecimalString()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLineTarget()
    })
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      ReportService.getGroupBuyIndexPage({now: moment(new Date()).format('YYYY-MM-DD')}).then(res => {
        this.loading = false
        this.rank.orderLoseRank = res.data.result.lostRank
        this.rank.orderWinRank = res.data.result.winRank
        this.rank.orderPriceRank = res.data.result.moneyRank
        this.hour.today = res.data.result.todayHour
        this.hour.yesterday = res.data.result.yesterdayHour
        this.targetLineData = res.data.result.list
        this.target.onlineTarget = res.data.result.target.groupBuyUserCount
        this.target.loseAwardAmountTarget = res.data.result.target.groupBuyCashAwardCount
        this.target.orderLoseCountTarget = res.data.result.target.groupBuyLoseOrderCount
        this.target.pointAwardTarget = res.data.result.target.groupBuyPointAwardCount
        this.target.orderWinPriceTarget = res.data.result.target.groupBuyHitOrderPriceCount
        this.target.orderWinCountTarget = res.data.result.target.groupBuyWinOrderCount
        this.newest.loseAward.day =res.data.result.newset.loseAwardAmount
        this.newest.loseAward.yesterday =this.target.loseAwardAmountTarget.value
        this.newest.orderHitAmount.day = res.data.result.newset.hitOrderAmount
        this.newest.orderHitAmount.yesterday = this.target.orderWinPriceTarget.value
        this.newest.onlineCount.day = res.data.result.newset.onlineCount
        this.newest.onlineCount.yesterday = this.target.onlineTarget.value
        this.newest.pointAward.day = res.data.result.newset.pointAwardAmount
        this.newest.pointAward.yesterday =this.target.pointAwardTarget.value
        this.hourLineDataHandle()
        this.drawLine()
        this.targetLineDataHandle()
        this.drawLineTarget()
      })
    },
    hourLineDataHandle() {
      let today = {
        name: '今日中奖订单金额',
        data: [],
        type: 'line',
        smooth: true
      }
      let yesterday = {
        name: '昨日中奖订单金额',
        data: [],
        type: 'line',
        smooth: true
      }
      for (let i = 0; i < this.hour.today.length; i++) {
        let ele = this.hour.today[i]
        let str = ''
        if (ele.hour.toString().length === 1) {
          str = `0${ele.hour}:00`
        } else {
          str = `${ele.hour}:00`
        }
        today.data.push(ele.price.toDecimalString())
        yesterday.data.push(this.hour.yesterday[i].price.toDecimalString())
        this.lineChartOptions.xAxis.data.push(str)
      }
      this.lineChartOptions.series.push(today)
      this.lineChartOptions.series.push(yesterday)
    },
    targetLineDataHandle() {
      this.targetChartOptions.xAxis.data = []
      for (const ele of this.targetLineData) {
        this.targetChartOptions.xAxis.data.push(ele.date)
      }
      this.selectTarget.push({
        key: 'orderWinPriceTarget',
        name: '中奖订单金额(元)'
      })
      this.selectTarget.push({
        key: 'loseAwardAmountTarget',
        name: '未中奖奖励金额(元)'
      })
      this.refreshTargetChart()
    },
    drawLine() {
      let ele = document.getElementById("newest-data-line")
      this.lineChart = echarts.init(ele)
      this.lineChart.setOption(this.lineChartOptions)
    },
    drawLineTarget() {
      let ele = document.getElementsByClassName("target-line-data")[0]
      this.targetLineChart = echarts.init(ele);
      this.targetLineChart.setOption(this.targetChartOptions)
    },
    onChange(e) {
      this.targetLoading = true
      ReportService.getGroupCoreTarget({now: e.format('YYYY-MM-DD')}).then(res => {
        this.targetLoading = false
        this.targetLineData = res.data.result.list
        this.target.onlineTarget = res.data.result.target.groupBuyUserCount
        this.target.loseAwardAmountTarget = res.data.result.target.groupBuyCashAwardCount
        this.target.orderLoseCountTarget = res.data.result.target.groupBuyLoseOrderCount
        this.target.pointAwardTarget = res.data.result.target.groupBuyPointAwardCount
        this.target.orderWinPriceTarget = res.data.result.target.groupBuyHitOrderPriceCount
        this.target.orderWinCountTarget = res.data.result.target.groupBuyWinOrderCount
        this.targetChartOptions.xAxis.data = []
        this.targetChartOptions.series = []
        this.targetChartOptions.legend.data = []
        for (const ele of this.targetLineData) {
          this.targetChartOptions.xAxis.data.push(ele.date)
        }
        this.refreshTargetChart()
        this.targetLineChart.setOption(this.targetChartOptions, true)
      })
    },
    addTargetLine(key, name) {
      this.targetChartOptions.legend.data.push(name)
      if (key === 'orderWinPriceTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyHitOrderPriceCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
      if (key === 'onlineTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyUserCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
      if (key === 'loseAwardAmountTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyCashAwardCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
      if (key === 'orderWinCountTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyWinOrderCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
      if (key === 'orderLoseCountTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyLoseOrderCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
      if (key === 'pointAwardTarget') {
        let series = {
          name: name,
          data: this.targetLineData.map(ele => ele.groupBuyPointAwardCount.toDecimalString()),
          type: 'line',
          smooth: true
        }
        this.targetChartOptions.series.push(series)
      }
    },
    onTargetChange(e) {
      if (e.selected) {
        this.selectTarget.push({key: e.key, name: e.name})
        this.addTargetLine(e.key, e.name)
      } else {
        let index = this.selectTarget.findIndex(ele => ele.key === ele.key)
        let legendNameIndex = this.targetChartOptions.legend.data.findIndex(ele => ele === e.name)
        let seriesNameIndex = this.targetChartOptions.series.findIndex(ele => ele === e.name)
        this.selectTarget.splice(index, 1)
        this.targetChartOptions.legend.data.splice(legendNameIndex, 1)
        this.targetChartOptions.series.splice(seriesNameIndex, 1)
      }
      this.targetLineChart.setOption(this.targetChartOptions, true)
    },
    refreshTargetChart() {
      for (let target of this.selectTarget) {
        this.addTargetLine(target.key, target.name)
      }
    },
    disabledDate(current) {
      return current > moment().subtract("day",1).endOf('day');
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  font-weight: 500;
  color: #323233;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.newest-panel {
  .left {
    #newest-data-line {
      height: 245px;
      width: 100%;
    }
  }

  .right {
    margin-left: 20px;

    .counter {
      height: 124px;
      background-color: #F7F8FB;
      border-radius: 5px;
      padding: 16px;
      margin-right: 8px;
      margin-bottom: 8px;

      .size {
        font-size: 14px;
      }
    }
  }
}

.core-target-panel {

  .target-line-data {
    width: 100%;
    height: 400px;
  }
}

.player-rank-panel {
  .rank-box {
    flex: 1;

    .rank-box-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 20px;
      color: #323233;
    }
  }
}


</style>