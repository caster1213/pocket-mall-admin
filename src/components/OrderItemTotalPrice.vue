<template>
  <table class="order-item-table">
    <thead>
    <tr>
      <td class="h4 font-size-12">商品</td>
      <td class="h4 font-size-12">小计</td>
      <td class="h4 font-size-12">优惠免减金额</td>
      <td class="h4 font-size-12">应收金额</td>
      <td class="h4 font-size-12">优惠抵扣</td>
      <td class="h4 font-size-12">积分抵扣</td>
      <td class="h4 font-size-12">加价/减价</td>
      <td class="h4 font-size-12">实收金额</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in list" :key="index">
      <td class="w250">
        <a-row type="flex">
          <div>
            <img style="width: 60px;height: 60px;border-radius: 10px;"
                 :src="item.img">
          </div>
          <div style="margin-left: 5px" class="w">
            <div>
              <span class="font-size-12 h4 line1">{{ item.title }}</span>
            </div>
            <div style="margin-top: 4px">
              <span class="font-size-12">数量：{{ item.count }}</span>
            </div>
            <div style="margin-top: 4px">
              <span class="font-size-12">价格：¥{{ item.salePriceText }}</span>
            </div>
          </div>
        </a-row>
      </td>
      <td class="top">
        <span class="font-size-12">{{ item.totalPrice }}</span>
      </td>
      <td class="top">
        <span class="font-size-12">0.00</span>
      </td>
      <td class="top">
        <span class="font-size-12">{{ item.receivablePriceText }}</span>
      </td>
      <td class="top">
        <span class="font-size-12">0.00</span>
      </td>
      <td class="top">
        <span class="font-size-12">{{ item.point }}</span>
      </td>
      <template v-if="isChangePrice">
        <td class="top">
          <a-space>
            <span>¥</span>
            <a-input @change="onRowPriceChange(item)" v-model.number="item.changePrice"
                     style="width: 80px"></a-input>
          </a-space>
        </td>
        <td class="top">
          <span class="font-size-12">{{ item.receiptsPriceText }}</span>
        </td>
      </template>
      <template v-else>
        <td class="top">
          <span class="font-size-12">{{ item.changePriceText }}</span>
        </td>
        <td class="top">
          <span class="font-size-12">{{ item.receiptsPriceText }}</span>
        </td>
      </template>
    </tr>
    <tr>
      <td style="padding-left: 70px;line-height: 50px" class="w250">
        <span class="h4 font-size-12">运费</span>
      <td style="line-height: 50px">
        <span class="font-size-12">{{ freightPriceText }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="font-size-12">0.00</span>
      </td>
      <td style="line-height: 50px">
        <span class="font-size-12">{{ freightReceivablePrice }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="font-size-12">0.00</span>
      </td>
      <td style="line-height: 50px">
        <span class="font-size-12">0.00</span>
      </td>
      <template v-if="isChangePrice">
        <td>
          <a-space>
            <span>¥</span>
            <a-input @change="onFreightPriceChange" v-model.number="freightChangePrice"
                     style="width: 80px"></a-input>
          </a-space>
        </td>
        <td>
          <span class="font-size-12">{{ freightReceiptsPriceText }}</span>
        </td>
      </template>
      <template v-else>
        <td>
          <span class="font-size-12">{{ freightChangePriceText }}</span>
        </td>
        <td>
          <span class="font-size-12">{{ freightReceivablePriceText }}</span>
        </td>
      </template>
    </tr>
    <tr>
      <td style="padding-left: 70px;line-height: 50px" class="w250">
        <span class="h4 font-size-12">总计</span>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">{{ totalText }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">0.00</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">{{ totalText }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">0.00</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">{{ totalUsePoint }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">{{ totalChangePriceText }}</span>
      </td>
      <td style="line-height: 50px">
        <span class="h4 font-size-12">{{ totalReceiptsPriceText }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import common from '../common/common';

export default {
  name: 'OrderItemTotalPrice',
  props: {
    freightOptions: Object,
    orderItems: Array,
    priceChangeTimer: Object,
    freightChangeTimer: Object,
    isChangePrice: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    freightPriceText() {
      return common.toDecimal2(this.freightPrice)
    },
    freightChangePriceText() {
      return common.toDecimal2(this.freightChangePrice)
    },
    freightReceivablePriceText() {
      return common.toDecimal2(this.freightReceivablePrice)
    },
    freightReceiptsPriceText() {
      return common.toDecimal2(this.freightReceiptsPrice + this.freightChangePrice)
    },
    totalText() {
      if (this.list.length === 0) return '0.00'
      let sum = this.list.reduce((total, current) => {
        total += parseFloat(current.totalPrice)
        return total
      }, 0)
      sum += this.freightPrice
      return common.toDecimal2(sum.toFixed(2))
    },
    /**
     * 总计-加减金额
     **/
    totalChangePriceText() {
      if (this.list.length === 0) return '0.00'
      let sum = this.list.reduce((total, current) => {
        total += current.changePrice
        return total
      }, 0)
      sum += this.freightChangePrice
      return common.toDecimal2(sum)
    },
    /**
     * 总计实收金额
     */
    totalReceiptsPriceText() {
      if (this.list.length === 0) return '0.00'
      let sum = this.list.reduce((total, current) => {
        total += parseFloat(current.totalPrice) + parseFloat(current.changePrice) - parseFloat(current.point)
        return total
      }, 0)
      sum += parseFloat(this.freightChangePrice) + this.freightPrice
      return common.toDecimal2(sum.toFixed(2))
    },
    totalUsePoint() {
      if (this.list.length === 0) return '0.00'
      let sum = this.list.reduce((total, current) => {
        total += parseFloat(parseFloat(current.point))
        return total
      }, 0)
      return common.toDecimal2(sum)
    }
  },
  data() {
    return {
      freightPrice: this.freightOptions.freightPrice,
      freightChangePrice: this.freightOptions.freightChangePrice,
      freightDiscountPrice1: this.freightOptions.freightDiscountPrice1,
      freightDiscountPrice2: this.freightOptions.freightDiscountPrice2,
      freightReceivablePrice: this.freightOptions.freightPrice,
      freightReceiptsPrice: this.freightOptions.freightPrice,
      list: this.orderItems.map(x => {
        return {
          id: x.id,
          salePrice: x.salePrice,
          salePriceText: common.toDecimal2(x.salePrice),
          count: x.count,
          img: x.img,
          title: x.title,
          totalPrice: 0,
          point: common.toDecimal2(x.usePoint),
          changePrice: x.changePrice,
          changePriceText: common.toDecimal2(x.changePrice),
          discountPrice1: x.discountPrice1,
          discountPrice2: x.discountPrice2,
          receivablePrice: 0,
          receiptsPrice: 0,
          receivablePriceText: 0,
          receiptsPriceText: 0
        }
      })
    }
  },
  created() {
    for (const item of this.list) {
      item.totalPrice = common.toDecimal2(item.count * item.salePrice)
      item.receivablePrice = item.count * item.salePrice
      item.receivablePriceText = common.toDecimal2(item.receivablePrice)
      item.receiptsPrice = item.count * item.salePrice + item.changePrice
      console.log(parseFloat(item.point))
      item.receiptsPriceText = common.toDecimal2(item.receiptsPrice - parseFloat(item.point))
    }
  },
  methods: {
    onRowPriceChange(row) {
      let sum = row.count * row.salePrice + row.changePrice
      row.receiptsPriceText = common.toDecimal2(sum)
      /*if (this.priceChangeTimer !== null) {
        window.clearTimeout(this.priceChangeTimer)
      }
      this.priceChangeTimer = window.setTimeout(() => {
        this.$emit('priceChange', {id: row.id, price: row.changePrice})
      }, 300)*/
      this.$emit('priceChange', {id: row.id, price: row.changePrice})
    },
    onFreightPriceChange() {
      if (this.freightChangeTimer !== null) {
        window.clearTimeout(this.freightChangeTimer)
      }
      this.freightChangeTimer = window.setTimeout(() => {
        this.$emit('freightPriceChange', this.freightChangePrice)
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
