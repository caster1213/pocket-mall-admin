<template>
  <div class="p-container">
    <div
      style="margin-bottom: 60px;"
      class="p-box p-box-bg-gary"
    >
      <div class="p-box p-box-bg-white">
        <a-row
          type="flex"
          justify="space-between"
        >
          <a-row type="flex">
            <a-space>
              <span class="font-size-12 p-input-right">筛选条件</span>
              <a-switch
                v-model="filter.isFilter"
                class="font-size-12 p-input-right"
              />
              <a-input-group
                style="display: flex;width: auto;"
                compact
              >
                <a-select
                  v-model="filter.timeOption"
                  class="font-size-12"
                >
                  <a-select-option value="createDate">
                    下单时间
                  </a-select-option>
                  <a-select-option value="payDate">
                    支付时间
                  </a-select-option>
                  <a-select-option value="deliveryDate">
                    发货时间
                  </a-select-option>
                </a-select>
                <a-range-picker
                  v-model="filter.timeValue"
                  @ok="getDataSource"
                  show-time
                />
              </a-input-group>
              <a-button
                :disabled="useBulkBtn"
                class="font-size-12  p-input-left"
              >
                批量标记
              </a-button>
              <a-button
                @click="onExportOrder"
                class="font-size-12  p-input-left"
              >
                订单导出
              </a-button>
            </a-space>
          </a-row>
          <a-row type="flex">
            <a-input-group
              style="display: inline-block;"
              compact
            >
              <a-select
                v-model="filter.searchOption"
                default-value="1"
                style="width: 100px"
                class="font-size-12"
              >
                <a-select-option value="orderNumber">
                  订单编号
                </a-select-option>
                <a-select-option value="productTitle">
                  商品名称
                </a-select-option>
                <a-select-option value="userName">
                  客户名称
                </a-select-option>
                <a-select-option value="userPhone">
                  客户电话
                </a-select-option>
                <a-select-option value="deliveryName">
                  收货人姓名
                </a-select-option>
                <a-select-option value="deliveryPhone">
                  收货人电话
                </a-select-option>
                <a-select-option value="transactionCode">
                  支付单号
                </a-select-option>
                <a-select-option value="expressCode">
                  快递单号
                </a-select-option>
              </a-select>
              <a-input-search
                v-model="filter.searchValue"
                @search="getDataSource"
                style="width: 150px"
              >
                <a-button
                  icon="search"
                  slot="enterButton"
                />
              </a-input-search>
            </a-input-group>
          </a-row>
        </a-row>
        <a-row
          v-show="filter.isFilter"
          style="flex-direction: column"
          type="flex"
        >
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">订单来源</label>
            <a-radio-group
              v-model="filter.orderSource"
              default-value=""
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="1">
                公众号
              </a-radio-button>
              <a-radio-button value="2">
                小程序
              </a-radio-button>
              <a-radio-button value="3">
                App
              </a-radio-button>
              <a-radio-button value="4">
                H5
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">营销类型</label>
            <a-radio-group
              v-model="filter.orderGenre"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="1">
                常规
              </a-radio-button>
              <a-radio-button value="4">
                拼团
              </a-radio-button>
              <a-radio-button value="3">
                分销
              </a-radio-button>
              <!-- <a-radio-button value="4">预售</a-radio-button>
               <a-radio-button value="5">限时折扣</a-radio-button>
               <a-radio-button value="6">周期购</a-radio-button>
               <a-radio-button value="7">积分兑换</a-radio-button>
               <a-radio-button value="8">限量抢购</a-radio-button>
               <a-radio-button value="9">社区团购</a-radio-button>
               <a-radio-button value="10">定价膨胀</a-radio-button>-->
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">商品类型</label>
            <a-radio-group
              v-model="filter.productGenre"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="1">
                实物商品
              </a-radio-button>
              <a-radio-button value="2">
                虚拟商品
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">订单状态</label>
            <a-radio-group
              v-model="filter.orderState"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="-1">
                已取消
              </a-radio-button>
              <a-radio-button value="1">
                待支付
              </a-radio-button>
              <a-radio-button value="2">
                待发货
              </a-radio-button>
              <a-radio-button value="3">
                已发货
              </a-radio-button>
              <a-radio-button value="4">
                已完成
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">售后状态</label>
            <a-radio-group
              v-model="filter.rebateState"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="2">
                售后中
              </a-radio-button>
              <a-radio-button value="3">
                售后结束
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">支付方式</label>
            <a-radio-group
              v-model="filter.payGenre"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="1">
                微信支付
              </a-radio-button>
              <a-radio-button value="4">
                支付宝
              </a-radio-button>
              <a-radio-button value="2">
                余额支付
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">配送方式</label>
            <a-radio-group
              v-model="filter.deliveryGenre"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button value="1">
                商家配送
              </a-radio-button>
              <a-radio-button value="2">
                到店自提
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <label class="font-size-12 p-input-right">标记筛选</label>
            <a-radio-group
              v-model="filter.marketGenre"
              class="font-size-12"
            >
              <a-radio-button value="">
                不限
              </a-radio-button>
              <a-radio-button
                style="padding: 0 8px"
                value="1"
              >
                <a-icon
                  :style="{fontSize:'16px'}"
                  :component="FlagIcon"
                />
              </a-radio-button>
              <a-radio-button
                style="padding: 0 8px"
                value="2"
              >
                <a-icon
                  :style="{fontSize:'18px'}"
                  :component="FlagYellow"
                />
              </a-radio-button>
              <a-radio-button
                style="padding: 0 8px"
                value="3"
              >
                <a-icon
                  :style="{fontSize:'18px'}"
                  :component="FlagGreen"
                />
              </a-radio-button>
              <a-radio-button
                style="padding: 0 8px"
                value="4"
              >
                <a-icon
                  :style="{fontSize:'18px'}"
                  :component="FlagBlue"
                />
              </a-radio-button>
              <a-radio-button
                style="padding: 0 8px"
                value="5"
              >
                <a-icon
                  :style="{fontSize:'18px'}"
                  :component="FlagViolet"
                />
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="order-filter-row">
            <a-button
              type="primary"
              class="font-size-12 p-input-right"
              @click="getDataSource"
            >
              搜索
            </a-button>
            <a-button
              class="font-size-12"
              @click="onClearFilter"
            >
              重置
            </a-button>
          </div>
        </a-row>
      </div>
      <div class="p-box-bg-white">
        <a-spin :spinning="filter.loading">
          <table class="order-table">
            <thead>
              <tr>
                <th style="width: 40px;">
                  <a-checkbox
                    @change="onCheckAll"
                    v-model="checkAll"
                  />
                </th>
                <th style="text-align: left;padding: 0">
                  商品信息
                </th>
                <th>实收款</th>
                <th>客户信息</th>
                <th>配送及支付方式</th>
                <th>订单状态</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <template v-if="dataSource.length >0">
                <template v-for="row in dataSource">
                  <tr :key="row.id">
                    <td style="width: 40px;text-align: center">
                      <a-checkbox v-model="row.checked" />
                    </td>
                    <td
                      colspan="6"
                      style="border-bottom: 2px solid #F2F2F6"
                    >
                      <a-row
                        type="flex"
                        justify="space-between"
                      >
                        <a-space>
                          <span
                            style="margin-right: 40px;margin-left: 0;"
                            class="font-size-12"
                          >订单编号：{{ row.orderNumber }}</span>
                          <span
                            style="margin-right: 40px"
                            class="font-size-12"
                          >下单时间：{{
                            moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
                          }}</span>
                          <span class="font-size-12">订单来源：APP</span>
                          <a-icon
                            v-if="row.lock"
                            type="lock"
                            style="font-size: 13px"
                          />
                        </a-space>
                        <div class="detail">
                          <a-space>
                            <router-link
                              :to="{path:'/order/detail',query:{orderNumber:row.orderNumber}}"
                              tag="span"
                            >
                              订单详情
                            </router-link>
                            <a-icon
                              v-if="row.marker === 1"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagIcon"
                            />
                            <a-icon
                              v-if="row.marker === 2"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagYellow"
                            />
                            <a-icon
                              v-if="row.marker === 4"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagBlue"
                            />
                            <a-icon
                              v-if="row.marker === 3"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagGreen"
                            />
                            <a-icon
                              v-if="row.marker === 5"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagViolet"
                            />
                            <a-icon
                              v-if="row.marker === 0"
                              @click="onMarker(row)"
                              :style="{fontSize:'18px'}"
                              :component="FlagGrey"
                            />
                          </a-space>
                        </div>
                      </a-row>
                    </td>
                  </tr>
                  <tr :key="row.id+'i'">
                    <td />
                    <td style="max-width: 250px;padding-bottom: 10px;padding-left: 0">
                      <a-row
                        v-for="(item,index) in row.orderItem"
                        :key="index"
                        style="flex-wrap: nowrap;margin-bottom: 5px;"
                        v-show="index<row.collapseCount"
                        type="flex"
                      >
                        <a-col>
                          <img
                            width="80px"
                            height="80px"
                            :src="item.productImage"
                          >
                        </a-col>
                        <a-col style="margin-left: 10px;width: calc(100% - 100px)">
                          <a-row
                            type="flex"
                            style="flex-direction: column"
                          >
                            <span
                              style="width: 100%"
                              class="font-size-12 text-row-1 font-bold"
                            >{{ item.productName }}</span>
                            <div style="padding-top: 5px">
                              <span class="font-size-12">数量：{{ item.quantity }}</span>
                            </div>
                            <span
                              v-if="item.sku.length>0"
                              class="font-size-12"
                            >规格：{{ item.sku }}</span>
                            <span
                              style="padding-top: 5px"
                              class="font-size-12"
                            >单价：¥{{ item.productPrice.toDecimalString() }}</span>
                          </a-row>
                        </a-col>
                      </a-row>
                      <a-button
                        v-show="row.orderItem.length>2"
                        type="link"
                        @click="()=>{
                          if(row.isCollapse){
                            row.collapseCount = 2
                            row.isCollapse = false
                          }else{
                            row.collapseCount = row.orderItem.length +1
                            row.isCollapse = true
                          }

                        }"
                        class="text-action-btn"
                      >
                        {{ row.isCollapse ? '收起' : '查看更多商品' }}
                      </a-button>
                    </td>
                    <td>
                      ¥{{ row.payPrice.toDecimalString() }}
                    </td>
                    <td>
                      {{ row.userName }}
                    </td>
                    <td>
                      <div
                        v-if="row.deliveryMode === 1"
                        class="font-size-12"
                      >
                        商家配送
                      </div>
                      <div
                        v-else-if="row.deliveryMode === 2"
                        class="font-size-12"
                      >
                        上门自提
                      </div>
                      <div
                        v-if="row.payGenre === 1"
                        class="font-size-12"
                      >
                        微信支付
                      </div>
                      <div
                        v-if="row.payGenre === 2"
                        class="font-size-12"
                      >
                        余额支付
                      </div>
                      <div
                        v-if="row.payGenre === 3"
                        class="font-size-12"
                      >
                        支付宝
                      </div>
                      <div
                        v-if="row.payGenre === 4"
                        class="font-size-12"
                      >
                        云闪付
                      </div>
                      <div
                        v-if="row.payGenre === 5"
                        class="font-size-12"
                      >
                        京东支付
                      </div>
                    </td>
                    <td>
                      <p-order-status-box
                        @delivered="onDelivered(row.orderNumber)"
                        @cancel="handleCancelEvent(row.orderNumber)"
                        :order-genre="row.orderGenre"
                        :order-state="row.orderState"
                        :is-send-freight="row.deliveryMode === 2"
                      />
                    </td>
                    <td style="text-align: right" />
                  </tr>
                </template>
              </template>
              <tr v-if="dataSource.length ===0">
                <td
                  align="center"
                  colspan="6"
                >
                  暂无订单数据
                </td>
              </tr>
            </tbody>
          </table>
        </a-spin>
      </div>
    </div>
    <p-footer-page
      :page-total="pageOption.pageTotal"
      :page-index="pageOption.pageIndex"
      @nextPage="(pageIndex)=>{
        pageOption.pageIndex = pageIndex
        getDataSource()
      }"
      @nextPageSize="(pageIndex,pageSize)=>{
        pageOption.pageIndex = 1
        pageOption.pageSize = pageSize
        getDataSource()
      }"
    />
  </div>
</template>

<script>
import FlagIcon from '@/components/icon/FlagIcon'
import FlagYellow from '@/components/icon/FlagYellow'
import FlagGreen from '@/components/icon/FlagGreen'
import FlagBlue from '@/components/icon/FlagBlue'
import FlagViolet from '@/components/icon/FlagViolet'
import FlagGrey from '@/components/icon/FlagGrey'
import moment from 'moment'
import orderService from '@/service/order.service'
import OrderService from '@/service/order.service'

class OrderRow {
  constructor() {
    this.id = ''
    this.orderNumber = ''
    this.createDate = ''
    this.checked = false
    this.source = 0
    this.payPrice = 0
    this.userName = ''
    this.orderDeliveryGenre = 0
    this.payGenre = 0
    this.orderState = 0
    this.market = 0
    this.orderItem = []
    this.spellStatus = null
    this.orderGenre = 0
    this.isCollapse = false
    this.collapseCount = 2
  }
}

class OrderItemRow {
  constructor() {
    this.productName = ''
    this.quantity = ''
    this.productPrice = 0
    this.productImage = ''
    this.sku = []
  }
}

export default {
  name: 'OrderPage',
  data() {
    return {
      FlagIcon: FlagIcon,
      FlagYellow: FlagYellow,
      FlagGreen: FlagGreen,
      FlagBlue: FlagBlue,
      FlagViolet: FlagViolet,
      FlagGrey: FlagGrey,
      pageOption: {
        pageSize: 25,
        pageIndex: 1,
        pageTotal: 0
      },
      filter: {
        isFilter: false,
        timeOption: 'createDate',
        timeValue: [],
        searchOption: 'orderNumber',
        searchValue: '',
        orderSource: '',
        orderGenre: '',
        orderState: '',
        rebateState: '',
        payGenre: '',
        deliveryGenre: '',
        marketGenre: '',
        productGenre: '',
        loading: false
      },
      checkAll: false,
      dataSource: [],
      moment: moment
    }
  },
  created() {
    this.getDataSource()
  },
  computed: {
    useBulkBtn() {
      if (this.dataSource.length === 0) return true
      return this.dataSource.filter(x => x.checked === true).length <= 0
    }
  },
  methods: {
    getFilterOption() {
      let filterOption = {}
      if (this.filter.timeValue.length > 0) {
        filterOption[this.filter.timeOption + 'Start'] = this.filter.timeValue[0].format('YYYY-MM-DD HH:mm:ss')
        filterOption[this.filter.timeOption + 'End'] = this.filter.timeValue[1].format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.filter.searchValue.length > 0) {
        filterOption[this.filter.searchOption] = this.filter.searchValue
      }
      if (this.filter.orderSource.length > 0) {
        filterOption.source = this.filter.orderSource
      }
      if (this.filter.orderState.length > 0) {
        filterOption.orderState = this.filter.orderState
      }
      if (this.filter.rebateState.length > 0) {
        filterOption.rebateProcessStatus = this.filter.rebateState
      }
      if (this.filter.orderGenre.length > 0) {
        filterOption.orderGenre = this.filter.orderGenre
      }
      if (this.filter.marketGenre.length > 0) {
        filterOption.orderMarker = this.filter.marketGenre
      }
      if (this.filter.payGenre.length > 0) {
        filterOption.payGenre = this.filter.payGenre
      }
      if (this.filter.deliveryGenre.length > 0) {
        filterOption.deliveryMode = this.filter.deliveryGenre
      }
      let filter = {pageIndex: this.pageOption.pageIndex, pageSize: this.pageOption.pageSize}
      filter = Object.assign(filterOption, filter)
      return filter
    },
    getDataSource() {
      this.filter.loading = true
      orderService.list(this.getFilterOption()).then(res => {
        this.filter.loading = false
        this.dataSource = res.data.result.list.map(x => {
          let row = new OrderRow()
          row.id = x.id
          row.orderNumber = x.orderNumber
          row.orderState = x.orderState
          row.createDate = x.createDate
          row.orderGenre = x.orderGenre
          row.payPrice = x.payPrice
          row.payGenre = x.payGenre
          row.userName = x.userName
          row.deliveryMode = x.orderDeliveryMode
          row.source = x.source
          row.marker = x.marker
          row.lock = x.lockStatus
          row.markerContent = x.markerContent
          row.orderItem = x.orderItem.map(s => {
            let item = new OrderItemRow()
            item.productImage = s.productImage
            item.productName = s.productName
            item.productPrice = s.productPrice
            item.quantity = s.quantity
            item.sku = s.sku
            return item
          })
          return row
        })
        this.pageOption.pageTotal = res.data.result.total
      })
    },
    onCheckAll() {
      this.dataSource.forEach(x => x.checked = this.checkAll)
    },
    onClearFilter() {
      this.filter.orderState = ''
      this.filter.orderSource = ''
      this.filter.orderGenre = ''
      this.filter.marketGenre = ''
      this.filter.payGenre = ''
      this.filter.deliveryGenre = ''
      this.filter.productGenre = ''
    },
    onDelivered(orderNumber) {
      this.$order.delivery({
        orderId: orderNumber,
        onSucceed: () => {
          this.$message.success(' 发货成功')
          this.getDataSource()
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    handleCancelEvent(orderNumber) {
      this.$order.canceled({
        id: orderNumber,
        onSucceed: () => {
          this.$message.success('订单取消成功')
          this.getDataSource()
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onMarker(row) {
      this.$order.marker({
        orderId: row.id,
        marker: row.marker,
        markerContent: row.markerContent,
        onSucceed: (res) => {
          row.marker = res.marker
          row.markerContent = res.content
          this.$message.success(' 操作成功')
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onExportOrder() {
      OrderService.export(this.getFilterOption()).then(() => {
        this.$message.success('导出任务创建成功！请前往数据-下载中心进行查看')
      })
    }
  }
}
</script>

<style scoped>
.order-filter-row {
  margin-top: 15px;
}

.order-filter-row /deep/ .ant-radio-button-wrapper {
  margin-right: 10px;
}

.order-table {
  width: 100%;
}

.order-table thead tr {
  border-bottom: 10px solid #F2F2F6;
  background-color: #fff
}

.order-table thead tr th {
  padding: 8px 15px;
}

.order-table tbody tr:nth-child(odd) {
  background-color: #fff;
  height: 50px
}

.order-table tbody tr:nth-child(even) {
  border-bottom: 10px solid #F2F2F6;
  background-color: #fff
}

.order-table tbody tr:nth-child(even) td:nth-of-type(1n+2) {
  padding: 8px 15px;
  border-top: 1px solid #F2F2F6;
  vertical-align: top;
}

.order-table .detail {
  padding: 8px 15px;
  cursor: pointer;
}

.order-table .detail:hover span {
  font-weight: bold;
}
</style>
