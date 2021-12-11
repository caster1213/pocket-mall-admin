<template>
  <a-table row-key="id" :columns="columns" :data-source="orderItem" :pagination="false">
    <template slot="action" slot-scope="val,row">
      <div v-if="row.rebateTotalAmount>0" class="mb5" style="font-size:13px;">
        <span>主动退款(-{{ row.rebateTotalAmount.toDecimalString() }})</span>
        <a className="ml5">记录</a>
      </div>
      <a-button :disabled="row.rebateTotalAmount>= row.salePrice * row.count" @click="$emit('tab', row)"
                style="font-size:13px;">主动退款
      </a-button>
    </template>
  </a-table>
</template>

<script>
export default {
  name: "OrderDetailPageItem",
  props: {
    orderItem: Array
  },
  data() {
    return {
      columns: [{
        title: '商品',
        width: '450px',
        customRender: (value, row) => {
          return (<div style="display:flex;align-items:center">
            <img style="width:48px;height:48px;" src={row.img}/>
            <a-row class="ml10" style="flex-direction: column; font-size:14px" type="flex">
              <a class="line1" style="fontSize:14px">{row.title}</a>
              <span style="color:#999;fontSize:13px">{row.sku}</span>
            </a-row>
          </div>)
        }
      }, {
        title: '单价',
        dataIndex: 'salePrice',
        customRender(value) {
          return value.toDecimalString()
        }
      }, {
        title: '数量',
        dataIndex: 'count'
      }, {
        title: '改价',
        dataIndex: 'changePrice',
        customRender(value) {
          return value.toDecimalString()
        },
      }, {
        title: '小计',
        customRender: (value, row) => {
          return ((row.salePrice * 100 * row.count) / 100).toDecimalString()
        }
      }, {
        title: '售后状态',
        scopedSlots: {customRender: 'action'}
      }, {
        title: '发货状态',
        dataIndex: 'isDelivery',
        customRender(value) {
          if (value) {
            return '已发货'
          } else {
            return '未发货'
          }
        }
      }]
    }
  },
  watch: {},
  created() {
    console.log(this.orderItem)
  },
  methods: {}
}
</script>

<style scoped>

</style>