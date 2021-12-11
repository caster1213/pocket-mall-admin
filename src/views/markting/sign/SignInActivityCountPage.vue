<template>
  <div>
    <a-title title="数据概览"/>
    <div class="sign-report">
      <div class="sign-report-left">
        <div id="sign-data-line" class="sign-report-left-line"></div>
      </div>
      <div class="sign-report-right">
        <div class="sign-report-right-panel">
          <a-statistic :value="count.userCount">
            <template slot="title">
              <a-row type="flex" align="middle">
                <div class="sign-report-right-panel-text">总签到用户数</div>
                <div class="q">
                  <a-tooltip title="签到至少一次的用户总数">
                    <a-icon type="question-circle"/>
                  </a-tooltip>
                </div>
              </a-row>
            </template>
          </a-statistic>
        </div>
        <div class="sign-report-right-panel">
          <a-statistic :value="count.avgCount">
            <template slot="title">
              <a-row type="flex" align="middle">
                <div class="sign-report-right-panel-text">人均签到次数</div>
                <div class="q">
                  <a-tooltip title="总签到次数/总签到用户数">
                    <a-icon type="question-circle"/>
                  </a-tooltip>
                </div>
              </a-row>
            </template>
          </a-statistic>
        </div>
        <div class="sign-report-right-panel">
          <a-statistic :value="count.signCount">
            <template slot="title">
              <a-row type="flex" align="middle">
                <div class="sign-report-right-panel-text">总签到次数</div>
                <div class="q">
                  <a-tooltip title="全部签到用户多次签到的总数">
                    <a-icon type="question-circle"/>
                  </a-tooltip>
                </div>
              </a-row>
            </template>
          </a-statistic>
        </div>
        <div class="sign-report-right-panel">
          <a-statistic :value="count.cycleCount">
            <template slot="title">
              <a-row type="flex" align="middle">
                <div class="sign-report-right-panel-text">连续满签次数</div>
                <div class="q">
                  <a-popover>
                    <template slot="content">
                      <span>签到满一个周期的总数</span>
                    </template>
                    <a-icon type="question-circle"/>
                  </a-popover>
                </div>
              </a-row>
            </template>
          </a-statistic>
        </div>
      </div>
    </div>
    <a-title title="周期数据"/>
    <div class="mt20 mb20">
      <a-table row-key="id" :columns="columns" :data-source="dataSource" @chang="onChange" :pagination="pagination"/>
    </div>
    <a-title title="签到数据"/>
    <div style="display: flex" class="mt10 mb10">
      <a-input-group style="width: 300px" compact>
        <a-select v-model="userSignFilter.key" style="width: 30%" default-value="nickname">
          <a-select-option value="nickname">
            用户姓名
          </a-select-option>
          <a-select-option value="phone">
            电话
          </a-select-option>
        </a-select>
        <a-input v-model="userSignFilter.value" style="width: 65%" placeholder="输入要查询的数据"/>
      </a-input-group>
      <a-button @click="onUserSignFind" type="primary">查询</a-button>
    </div>
    <div class="mt20">
      <a-table row-key="userId" :loading="userSignLoading" :columns="userSignColumns" :data-source="userSignDataSource"
               @change="onSignPageChange"
               :pagination="userSignPagination"/>
    </div>
  </div>
</template>

<script>
import Title from "../../../components/Title"
import * as  echarts from 'echarts'
import SignService from '../../../service/sign.service'
import {getPaginationConfig} from '../../../common/field'
import moment from 'moment'

export default {
  name: "SignInActivityCountPage",
  components: {
    'a-title': Title
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine()
    })
  },
  data() {
    return {
      lineChart: null,
      lineChartOptions: {
        title: {
          text: '近30日签到用户数据趋势',
          textStyle: {
            fontSize: 13
          },
          subtext: "人数",
          padding: 15
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: ['09-23', '09-24', '09-25', '09-26', '09-27', '09-28', '09-29', '09-30'],
          axisTick: {
            lineStyle: {
              type: "dashed"
            },
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      columns: [{
        title: '周期',
        dataIndex: 'date',
        customRender: (value, row) => {
          return `${moment(value).subtract(row.day, "days").format('YYYY.MM.DD')} - ${moment(value).format('YYYY.MM.DD')}`
        }
      }, {
        title: '签到用户数',
        dataIndex: 'userCount'
      }, {
        title: '总签到次数',
        dataIndex: 'signCount'
      }, {
        title: '奖励发放情况',
        dataIndex: 'signPointCount'
      }],
      count: {
        userCount: 0,
        signCount: 0,
        cycleCount: 0,
        avgCount: 0
      },
      dataSource: [],
      pagination: getPaginationConfig(),
      userSignColumns: [{
        title: '用户名称',
        dataIndex: 'nickname'
      }, {
        title: '电话',
        dataIndex: 'phone'
      }, {
        title: '第一次签到时间',
        dataIndex: 'firstSignDate'
      }, {
        title: '最后一次签到时间',
        dataIndex: 'lastSignDate'
      }, {
        title: '周期满签次数',
        dataIndex: 'cycleTotal'
      }, {
        title: '累计签到次数',
        dataIndex: 'totalSignTotal'
      }],
      userSignDataSource: [],
      userSignPagination: getPaginationConfig(),
      userSignLoading: false,
      userSignFilter: {
        key: 'nickname',
        value: ''
      }
    }
  },
  created() {
    this.firstLoad()
  },
  methods: {
    drawLine() {
      let ele = document.getElementById("sign-data-line")
      this.lineChart = echarts.init(ele);
      this.lineChart.setOption(this.lineChartOptions)
    },
    firstLoad() {
      Promise.all([SignService.getSignCount(), SignService.getCycleList({
        pageIndex: 1,
        pageSize: 25
      }), SignService.getUserSignList({pageIndex: 1, pageSize: 25})]).then(results => {
        this.count = results[0].data.result
        this.dataSource = results[1].data.result.list
        this.userSignDataSource = results[2].data.result.list
        this.userSignPagination.total = results[2].data.result.total
        this.lineChartOptions.xAxis.data = results[0].data.result.line.map(x => x.key)
        this.lineChartOptions.series.push({
          name: '签到用户数',
          data: results[0].data.result.line.map(x => parseInt(x.value)),
          type: 'line',
          smooth: true
        })
        this.drawLine()
      })
    },
    onChange(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
    },
    onSignPageChange(e) {
      this.userSignPagination.current = e.current
      this.userSignPagination.pageSize = e.pageSize
    },
    onUserSignFind() {
      this.userSignLoading = true
      let query = {
        pageIndex: this.userSignPagination.current,
        pageSize: this.userSignPagination.pageSize
      }
      if (this.userSignFilter.value.length > 0) {
        query[this.userSignFilter.key] = this.userSignFilter.value
      }
      SignService.getUserSignList(query).then(res => {
        this.userSignLoading = false
        this.userSignDataSource = res.data.result.list
        this.userSignPagination.total = res.data.result.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sign-report {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  height: 280px;
  margin-bottom: 30px;

  .sign-report-left {
    flex: 1;
    background-color: #f8f8f8;
    margin-right: 20px;

    .sign-report-left-line {
      height: 100%;
      width: 100%;
    }
  }

  .sign-report-right {
    background-color: #f8f8f8;
    display: flex;
    flex-flow: wrap;
    flex: 1;

    .sign-report-right-panel {
      flex: 1 0 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .sign-report-right-panel-text {
        font-weight: 500;
        color: #323233;
        font-size: 13px;
        margin-right: 10px;
      }

      .q {
        cursor: pointer;
      }
    }
  }
}
</style>
