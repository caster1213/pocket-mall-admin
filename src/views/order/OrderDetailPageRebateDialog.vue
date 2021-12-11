<template>
  <a-modal width="800px" :confirm-loading="loading" v-model="display" @ok="onSubmit" title="主动退款">
    <a-alert banner>
      <template slot="description">
        <div>主动退款仅支持分销订单、拼图订单</div>
        <div>操作前请确保上级账户有足够的的余额扣除复购奖</div>
      </template>
    </a-alert>
    <div class="mt15">
      <a-table row-key="id" :columns="columns" :pagination="false" :data-source="dataSource"/>
    </div>
  </a-modal>
</template>

<script>
import pattern from '../../common/pattern'
import OrderService from '../../service/order.service'
import util from '../../common/common'

export default {
  name: "OrderDetailPageRebateDialog",
  props: {
    orderNumber:String,
    orderItems: Array,
    display: Boolean
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      columns: [{
        title: '商品',
        width: '150px',
        dataIndex: 'title',
        customRender: (value) => {
          return <a class="line1">{value}</a>
        }
      }, {
        title: '可退金额 (元)',
        width: '100px',
        dataIndex: 'availableAmount'
      }, {
        title: '退款金额 (元)',
        width: '120px',
        customRender: (val, row) => {
          return (
              <div class={{'has-error': row.isError}}>
                <a-input onChange={(e) => {
                  this.onChange(e)
                }} value={row.value} placeholder="请输入退款金额"/>
                {row.isError ? <span style="color:red">{row.errorMessage}</span> : ''}
              </div>
          )
        }
      }]
    }
  },
  watch: {
    display() {
      if (this.display === false) return
      this.dataSource = this.orderItems.map(ele => {
        return {
          id: ele.id,
          title: ele.title,
          sku: ele.sku,
          availableAmount: ele.salePrice - ele.rebateTotalAmount,
          value: '',
          isError: false,
          errorMessage: ''
        }
      })
      console.log(this.orderItems)
    }
  },
  methods: {
    onChange(e) {
      let row = this.dataSource.map(ele => ele)
      row[0].value = e.target.value
      if (pattern.decimal2.test(e.target.value) === false) {
        row[0].isError = true
        row[0].errorMessage = "请输入正确的格式"
        this.dataSource = [...row]
        return
      }
      if (parseFloat(row[0].value) > row[0].availableAmount) {
        row[0].isError = true
        row[0].errorMessage = "退款金额不能超过可退金额"
        this.dataSource = [...row]
        return
      }
      row[0].isError = false
      this.dataSource = [...row]
    },
    onSubmit() {
      this.loading = true
      OrderService.rebate({
        orderNumber: this.orderNumber,
        items: this.dataSource.map(ele => {
          return {
            orderItemId: ele.id,
            rebateAmount: ele.value
          }
        })
      }).then(res => {
        this.loading = false
        this.$emit('complete')
        if (util.isSuccess(res)) {
          this.$message.success("退款成功")
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.has-error .ant-input {
  border-color: red;
}
</style>