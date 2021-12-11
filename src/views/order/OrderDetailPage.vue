<template>
  <page :loading="loading">
    <div class="p-box p-box-bg-gary">
      <div class="p-box p-box-bg-white">
        <a-row type="flex" class="" style="border-bottom: 1px solid rgb(238,239,242);padding-bottom: 10px;">
          <div style="font-size: 14px">
            <span>订单编号:</span>
            <span>{{ orderNumber }}</span>
          </div>
          <div class="ml20" style="font-size: 14px">
            <span>下单时间:</span>
            <span>{{ createDate }}</span>
          </div>
          <div class="ml20" style="font-size: 14px">
            <span>{{ orderGenre }}</span>
          </div>
        </a-row>
        <div style="display: flex;" class="mt15">
          <div style="min-width: 300px; border-right: 1px solid rgb(238,239,242)">
            <div style="padding:0 15px">
              <span class="font-bold h5">订单状态：{{ orderStateText }}</span>
            </div>
            <div style="padding:0 15px ;margin-top: 10px">
              <span class="text-muted">{{ orderStateTipText }}</span>
            </div>
            <div v-if="orderRebateAmount>0" style="padding:0 15px ;margin-top: 10px">
              <a-row type="flex">
                <span class="text-muted">订单退款金额：{{ orderRebateAmount.toDecimalString() }} 元</span>
                <router-link :to="{path:'/order/rebate/amount',query:{orderNumber:orderNumber}}" class="ml10">查看钱款去向
                </router-link>
              </a-row>
            </div>
            <div style="padding:0 15px ;margin-top: 10px">
              <a-button v-if="orderState === orderStateOption.notPay"
                        @click="onPriceChange"
                        class="font-size-12 p-input-right-5">
                改价
              </a-button>
              <a-button v-if="isDeliveryDisplay" @click="onDelivery"
                        class="font-size-12 p-input-right-5">发货
              </a-button>
              <a-button v-if="orderState === orderStateOption.notPay" @click="onCancel"
                        class="font-size-12 p-input-right-5">取消订单
              </a-button>
              <a-button @click="onMarker" class="font-size-12">
                <a-icon style="font-size: 16px" :component="getMarker"></a-icon>
                <span>标记</span>
              </a-button>
            </div>
            <div style="padding:0 15px;margin-top: 10px">
              标记内容：{{ markerContent }}
            </div>
          </div>
          <p-order-step-flow v-if="orderSteps.length > 0" :order-state="orderState"
                             :state-flows="orderSteps"/>
        </div>
      </div>
      <div class="p-box p-box-bg-white">
        <div style="margin-top: 20px;padding: 0 15px">
          <a-row type="flex">
            <a-col span="6">
              <div style="padding:0 15px">
                <span class="font-bold h5">收件人信息</span>
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                收货人姓名：{{ address.name }}
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                收货人电话：{{ address.phone }}
              </div>
              <div v-if="address.siteName" style="padding:0 15px;margin-top: 10px">
                自提站点：{{ address.siteName }}
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                <span
                    style="margin-right: 15px">收货地址：{{
                    address.province
                  }},{{ address.city }},{{ address.district }},{{ address.detail }}</span>
                <a-icon v-if="deliveryMode === 1" @click="onAddress" style="cursor: pointer"
                        type="edit"/>
              </div>
            </a-col>
            <a-col span="6">
              <div style="padding:0 15px">
                <span class="font-bold h5">配送信息</span>
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                配送方式：{{ deliveryName }}
              </div>
              <div v-if="isDelivery" style="padding:0 15px;margin-top: 10px">
                快递公司：{{ expressName }}
              </div>
              <div v-if="isDelivery" style="padding:0 15px;margin-top: 10px">
                快递单号：{{ expressNumber }}
              </div>
              <div v-if="isDelivery" style="padding:0 15px;margin-top: 10px">
                发货日期：{{ getDeliveryTime }}
              </div>
            </a-col>
            <a-col span="6">
              <div style="padding:0 15px">
                <span class="font-bold h5">付款信息</span>
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                付款金额：{{ paymentAmount.toDecimalString() }}
              </div>
              <div v-if="isPayment" style="padding:0 15px;margin-top: 10px">
                付款方式：{{ getPaymentText }}
              </div>
              <div v-if="isPayment" style="padding:0 15px;margin-top: 10px">
                付款日期：{{ paymentDate }}
              </div>
            </a-col>
            <a-col span="6">
              <div style="padding:0 15px">
                <span class="font-bold h5">买家信息</span>
              </div>
              <div style="padding:0 15px;margin-top: 10px">
                买家：{{ userName }}、{{userPhone}}
              </div>
              <div v-if="isPayment" style="padding:0 15px;margin-top: 10px">
                买家留言：{{ remark }}
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="p-box p-box-bg-white">
        <order-detail-page-item @tab="(value)=>{
          this.orderRebateDialogDisable = true
          this.orderRebateDialogModel = [...value]
        }" :order-item="orderItems"/>
        <div class="mt20">
          <div class="mt5" style="display: flex;justify-content: right;padding-right: 40px;font-size: 14px">
            <span>商品总价：</span>
            <span style="width: 70px;text-align: right">{{ productSaleTotalPrice.toDecimalString() }}</span>
          </div>
          <div class="mt5" style="display: flex;justify-content: right;padding-right: 40px;font-size: 14px">
            <div style="width: 120px;text-align: right">改价：</div>
            <div style="width: 70px;text-align: right">{{ changeTotalPrice.toDecimalString() }}</div>
          </div>
          <div class="mt5" style="display: flex;justify-content: right;padding-right: 40px;font-size: 14px">
            <div style="width: 120px;text-align: right">运费：</div>
            <div style="width: 70px;text-align: right">{{ freightPrice.toDecimalString() }}</div>
          </div>
          <div class="mt5" style="display: flex;justify-content: right;padding-right: 40px;font-size: 14px">
            <div style="width: 120px;text-align: right">积分：</div>
            <div style="width: 70px;text-align: right">{{ paymentPoint.toDecimalString() }}</div>
          </div>
          <div class="mt15" style="display: flex;justify-content: right;padding-right: 40px">
            <div style="font-size: 16px;font-weight: bold;width:120px;text-align: right">实收款：</div>
            <div style="font-size: 16px;font-weight: bold;color: #D40000;width: 70px;text-align: right">
              {{ paymentAmount.toDecimalString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <order-detail-page-rebate-dialog
        @compete="()=>{
          this.getOrder()
          this.orderRebateDialogDisable = false
        }"
        :order-number="orderNumber"
        :display="orderRebateDialogDisable"
        :order-items="orderRebateDialogModel"/>
  </page>
</template>

<script>
import orderService from '../../service/order.service'
import FlagGrey from '../../components/icon/FlagGrey'
import FlagRed from '../../components/icon/FlagIcon'
import FlagYellow from '../../components/icon/FlagYellow'
import FlagGreen from '../../components/icon/FlagGreen'
import FlagBlue from '../../components/icon/FlagBlue'
import FlagViolet from '../../components/icon/FlagViolet'
import Page from '../../components/Page'
import constant from '../../common/constant'
import OrderDetailPageItem from "./OrderDetailPageItem"
import OrderDetailPageRebateDialog from "./OrderDetailPageRebateDialog"

export default {
  name: 'OrderDetailPage',
  components: {
    Page,
    OrderDetailPageItem,
    OrderDetailPageRebateDialog
  },
  data() {
    return {
      loading: false,
      orderStateOption: constant.orderState,
      orderRebateDialogDisable: false,
      orderRebateDialogModel: [],
      tap: 2,
      FlagGrey: FlagGrey,
      createDate: '',
      lock: false,
      orderSteps: [],
      orderId: '',
      orderNumber: '',
      deliveryName: '',
      deliveryDate: '',
      deliveryMode: 0,
      userName: '',
      userPhone: '',
      orderState: 0,
      freightName: '',
      remark: '',
      marker: '',
      paymentAmount: '',
      paymentGenre: 0,
      paymentNumber: '',
      paymentDate: '',
      paymentPoint:0,
      orderRebateAmount: 0,
      markerContent: -1,
      address: {
        startDate: null,
        endDate: null
      },
      source: '',
      marketing: '',
      orderGenre: '',
      freightPrice: 0,
      freightChangePrice: 0,
      changeTotalPrice: 0,
      productSaleTotalPrice: 0,
      expressName: '',
      expressNumber: '',
      orderItemTotal: {
        total: '0.00',
        discountPrice1: '0.00',
        discountPrice2: '0.00',
        changePrice: '0.00',
        receivable: '0.00',
        receipts: '0.00'
      },
      orderItems: []
    }
  },
  created() {
    this.getOrder()
  },
  computed: {
    isDeliveryDisplay() {
      console.log(constant.orderState.payment === this.orderState)
      return constant.orderState.payment === this.orderState
    },
    isCancelDisplay() {
      if (constant.orderState.notPay === this.orderState || constant.orderState.payment === this.orderState) {
        return true
      } else {
        return false
      }
    },
    orderStateText() {
      if (this.lock) {
        return '已锁定'
      }
      if (this.orderState === constant.orderState.notPay) {
        return '买家未付款'
      }
      if (this.orderState === constant.orderState.payment) {
        return '已付款，待发货'
      }
      if (this.orderState === constant.orderState.delivery) {
        return '已发货，待收货'
      }
      if (this.orderState === constant.orderState.confirm) {
        return '已收货'
      }
      if (this.orderState === constant.orderState.overtimeClose) {
        return '超时未支付,已取消'
      }
      if (this.orderState === constant.orderState.cancel) {
        return '用户取消支付'
      }

      return ''
    },
    orderStateTipText() {
      if (this.lock) {
        return '请等待买家解除订单锁定'
      }
      if (this.orderState === constant.orderState.notPay) {
        return '请提醒买家付款'
      }
      if (this.orderState === constant.orderState.payment) {
        return '买家已提交订单，请尽快发货。'
      }
      if (this.orderState === constant.orderState.delivery) {
        return '如买家7天内未确认收货， 系统将自动完成交易。'
      }
      if (this.orderState === constant.orderState.confirm) {
        return '买家已确认收货，订单完成'
      }
      return ''
    },
    getMarker() {
      if (this.marker === constant.orderMarket.red) {
        return FlagRed
      } else if (this.marker === constant.orderMarket.yellow) {
        return FlagYellow
      } else if (this.marker === constant.orderMarket.blue) {
        return FlagBlue
      } else if (this.marker === constant.orderMarket.green) {
        return FlagGreen
      } else if (this.marker === constant.orderMarket.violet) {
        return FlagViolet
      } else {
        return FlagGrey
      }
    },
    getPaymentText() {
      switch (this.paymentGenre) {
        case constant.orderPayType.aliPay:
          return '支付宝'
        case constant.orderPayType.wxPay:
          return '微信支付'
        case constant.orderPayType.balance:
          return '余额支付'
        case constant.orderPayType.free:
          return '无需支付'
        default:
          return '暂无'
      }
    },
    getDeliveryTime() {
      if (this.deliveryDate === '0001-01-01 00:00:00') {
        return ''
      } else {
        return this.deliveryDate
      }
    },
    isDelivery() {
      return this.deliveryDate !== '0001-01-01 00:00:00'
    },
    isPayment() {
      return this.paymentDate !== '0001-01-01 00:00:00'
    }
  },
  methods: {
    getOrder() {
      let orderNumber = this.$route.query.orderNumber
      this.loading = true
      orderService.get({orderNumber: orderNumber}).then(res => {
        this.loading = false
        if (res.data.code === constant.serviceCode.success) {
          this.orderId = res.data.result.orderId
          this.createDate = res.data.result.createDate
          this.orderNumber = res.data.result.orderNumber
          this.orderState = res.data.result.orderState
          this.deliveryName = res.data.result.deliveryName
          this.deliveryDate = res.data.result.deliveryDate
          this.orderRebateAmount = res.data.result.orderRebateAmount
          this.userName = res.data.result.userName
          this.userPhone = res.data.result.userPhone
          this.remark = res.data.result.remark
          this.marker = res.data.result.marker
          this.productSaleTotalPrice = res.data.result.productSaleTotalPrice
          this.changeTotalPrice = res.data.result.changeTotalPrice
          this.deliveryMode = res.data.result.deliveryMode
          this.freightPrice = res.data.result.freightPrice
          this.freightChangePrice = res.data.result.freightChangePrice
          this.markerContent = res.data.result.markerContent
          this.address = res.data.result.delivery
          this.expressName = res.data.result.expressName
          this.expressNumber = res.data.result.expressNumber
          this.paymentGenre = res.data.result.payGenre
          this.paymentNumber = res.data.result.payCode
          this.paymentDate = res.data.result.payDate
          this.paymentPoint = res.data.result.payPoint
          this.paymentAmount = res.data.result.payPrice
          this.lock = res.data.result.lockStatus
          this.source = res.data.result.orderSource
          this.marketing = res.data.result.marketGenre
          this.orderGenre = res.data.result.orderGenre
          this.orderSteps = res.data.result.orderStateFlows
          if (this.remark === null || this.remark.length === 0) {
            this.remark = '-'
          }
          if (this.markerContent === null || this.markerContent.length === 0) {
            this.markerContent = '-'
          }
          this.orderItems = res.data.result.orderItem.map(x => {
            return {
              id: x.id,
              img: x.productImage,
              usePoint: x.usePoint,
              sku: x.skuLabel,
              title: x.productTitle,
              count: x.productQuantity,
              salePrice: x.productSalePrice,
              rebateTotalAmount: x.rebateTotalAmount,
              changePrice: x.changePrice,
              isDelivery: x.isDelivery
            }
          })
        }
      })
    },
    onMarker() {
      this.$order.marker({
        orderId: this.orderId,
        marker: this.marker,
        message: this.markerContent,
        onSucceed: (res) => {
          this.marker = res.marker
          this.markerContent = res.content
          this.$message.success(' 操作成功')
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onDelivery() {
      this.$order.delivery({
        orderId: this.orderNumber,
        onSucceed: () => {
          this.$message.success(' 发货成功')
          this.getDataSource()
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onCancel() {
      this.$order.canceled({
        id: this.orderNumber,
        onSucceed: () => {
          this.$message.success('订单取消成功')
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onAddress() {
      this.$order.updateAddress({
        orderNumber: this.orderNumber,
        name: this.address.name,
        phone: this.address.phone,
        district: [this.address.province, this.address.city, this.address.district],
        detail: this.address.detail,
        postCode: '',
        onSucceed: () => {
          this.$message.success('收货信息更新成功')
          this.getOrder()
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    },
    onPriceChange() {
      this.$order.priceChanged({
        orderNumber: this.orderNumber,
        orderItems: this.orderItems,
        freightPrice: this.freightPrice,
        freightChangePrice: this.freightChangePrice,
        onSucceed: () => {
          this.$message.success('订单价格修改成功')
          this.getOrder()
        },
        onFailed: (err) => {
          this.$message.error(err)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
