import Vue from 'vue'
import OrderUpdateMarket from './OrderUpdateMarket'
import orderService from '../../service/order.service'
import constant from '../../common/constant'

export default (options) => {
  let instance = Vue.extend(OrderUpdateMarket)
  let order = new instance({
    data() {
      return {
        visible: true,
        message: '',
        marker: '',
        loading: false,
        cancelBtnText: '取消',
        isDelete: false
      }
    },
    created() {
      this.message = options.markerContent
      for (const key in constant.orderMarket) {
        if (constant.orderMarket[key] === options.marker) {
          this.marker = key
        }
      }
    },
    methods: {
      onClose() {
        this.visible = false
        document.body.appendChild(order.$el)
      },
      onConfirm() {
        if (this.marker.length === 0) {
          this.$message.warning('请选择一个标记')
          return
        }
        this.loading = true
        orderService.setMarket({
          orderId: options.orderId,
          message: this.message,
          marker: constant.orderMarket[this.marker]
        }).then(res => {
          this.loading = false
          if (res.data.code === constant.serviceCode.success) {
            let m = {
              marker: constant.orderMarket[this.marker],
              content: this.message
            }
            console.log(m)
            options.onSucceed(m)
            this.visible = false
          } else {
            options.onFailed(res.data.msg)
          }
        })
      },
      onChange(value) {
        this.marker = value
      }
    }
  })
  order.$mount()
  document.body.appendChild(order.$el)
}
