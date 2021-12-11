import Vue from 'vue'
import OrderDelivery from "./OrderDelivery"
import OrderService from "../../service/order.service"
import moment from "moment"
import constant from "../../common/constant"


let Index = (options) => {
    let VueOrderDelivery = Vue.extend(OrderDelivery)
    let order = new VueOrderDelivery({
        data() {
            return {
                orderId: options.orderId,
                visible: true,
                orderNumber: '',
                orderCreateDate: '',
                deliver: '',
                expressOption: [],
                expressName: '',
                expressCode: '',
                loading: false,
                name: '',
                phone: '',
                times: [],
                isVerification: false
            }
        },
        computed: {
            getTimes() {
                if (this.times.length === 0) {
                    return '暂无预约时间'
                }
                let day = moment(this.times[0]).format('YYYY[年]MM[月]DD')
                let h1 = moment(this.times[0]).format('HH:mm')
                let h2 = moment(this.times[1]).format('HH:mm')
                return `${day} ${h1}-${h2}`
            },
            getTitle() {
                if (this.isVerification) {
                    return '订单核销'
                } else {
                    return '订单发货'
                }
            }
        },
        created() {
            this.getDataSource()
        },
        methods: {
            handleOkEvent() {
                if (this.isVerification === false) {
                    this.expressDelivery()
                    return
                }
                this.verification()
            },
            handleCancelEvent() {
                this.visible = false
            },
            getDataSource() {
                OrderService.getDeliveryOrder({orderNumber: this.orderId}).then(res => {
                    let result = res.data.result
                    this.isVerification = result.deliveryMode === constant.freightModel.sendFreight
                    this.orderNumber = result.orderNumber
                    this.name = result.name
                    this.phone = result.phone
                    this.times = result.times
                    this.orderCreateDate = moment(result.createDate).format('YYYY-MM-DD HH:mm:ss')
                    this.deliver = result.name + ',' + result.phone + ',' + result.province + result.city + result.district + result.detailAddress
                    this.expressOption = result.expressOption
                })
            },
            expressDelivery() {
                if (this.expressName.length <= 0) {
                    this.$message.warning('请选择一个快递公司')
                    return
                }
                if (this.expressCode.length <= 0) {
                    this.$message.warning('请输入快递单号')
                    return
                }
                this.loading = true
                OrderService.deliver({
                    orderId: this.orderId,
                    expressName: this.expressName,
                    expressCode: this.expressCode
                }).then(res => {
                    if (res.data.code === constant.serviceCode.success) {
                        this.loading = false
                        this.visible = false
                        options.onSucceed()
                    } else {
                        options.onFailed(res.data.msg)
                        this.loading = false
                    }
                })
            },
            verification() {
                this.loading = true
                OrderService.verificationConfirm({orderNUmber: this.orderId}).then(res => {
                    this.loading = false
                    if(res.data.code === constant.serviceCode.success){
                        this.$message.success('核销成功')
                        this.visible = false
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
        }
    })
    let vm = order.$mount()
    let el = vm.$el
    document.body.appendChild(el)
}

export default Index
