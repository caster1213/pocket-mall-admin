import Vue from 'vue'
import OrderCancelConfirm from "./OrderCancelConfirm"
import constant from "../../common/constant";
import OrderService from '../../service/order.service'

export default (options) => {
    let instance = Vue.extend(OrderCancelConfirm)
    let order = new instance({
        data() {
            return {
                visible: true,
                orderId: options.id,
                cancelOption: '0',
                cancelMessage: '',
                loading: false
            }
        },
        methods: {
            handleSuccessEvent() {
                if (this.cancelOption === '0') {
                    this.$message.warning('请选择一个取消的理由')
                    return
                }
                this.loading = true
                OrderService.cancel({
                    orderNumber: this.orderId,
                    reason: this.cancelOption,
                    describe: this.cancelMessage
                }).then(res => {
                    let r = res.data
                    if (r.code === constant.serviceCode.success) {
                        options.onSucceed()
                        this.loading = false
                        this.visible = false
                    } else {
                        options.onFailed(r.msg)
                        this.loading = false
                    }
                })
            },
            handleCancelEvent() {
                this.visible = false
            }
        }
    })
    order.$mount()
    document.body.appendChild(order.$el)
}
