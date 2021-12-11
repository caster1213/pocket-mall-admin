import Vue from 'vue'
import OrderChangePrice from "./OrderChangePrice"
import OrderService from '../../service/order.service'
import constant from "../../common/constant"

export default (options) => {
    let instance = Vue.extend(OrderChangePrice)
    let orderChangePrice = new instance({
        data() {
            return {
                visible: true,
                loading:false,
                orderNumber: options.orderNumber,
                orderItems: options.orderItems.map(x => x),
                freightPrice: options.freightPrice,
                freightChangePrice: options.freightChangePrice,
                entity:{
                    changePrices: [],
                    freightPrice:options.freightChangePrice
                }
            }
        },
        methods: {
            onConfirm() {
                this.loading = true
                OrderService.priceChanged({
                    orderNumber:this.orderNumber,
                    updatePrices:this.entity.changePrices,
                    freightPrice: this.entity.freightPrice
                }).then(res=>{
                    this.loading = false
                    if(res.data.code === constant.serviceCode.success){
                        options.onSucceed()
                        this.visible = false
                    }else{
                        options.onFailed(res.data.msg)
                    }
                })
            },
            onCancel() {
                this.visible = false
            },
            onPriceChange(e) {
                let index = this.entity.changePrices.findIndex(x => x.id === e.id)
                if (index === -1) {
                    this.entity.changePrices.push({
                        id: e.id,
                        changePrice: e.price
                    })
                } else {
                    this.entity.changePrices[index].changePrice = e.price
                }
            },
            onFreightPriceChange(e) {
                console.log(e)
                this.entity.freightPrice = e
            }
        }
    })
    orderChangePrice.$mount()
    document.body.appendChild(orderChangePrice.$el)
}
