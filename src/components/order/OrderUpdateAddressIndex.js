import Vue from 'vue'
import OrderUpdateAddress from "./OrderUpdateAddress"
import constant from "../../common/constant"
import OrderService from '../../service/order.service'
import area from "../../common/area";

export default (options) => {
    let instance = Vue.extend(OrderUpdateAddress)
    let order = new instance({
        data() {
            return {
                visible: true,
                orderNumber: options.orderNumber,
                entity: {
                    name: options.name,
                    phone: options.phone,
                    district: [],
                    detail: options.detail,
                    postCode: options.postCode,
                },
                loading: false,
                rules: {
                    name: [{
                        required: true, message: '收件人姓名必须填写'
                    }],
                    phone: [{
                        required: true, message: '收件人电话必须填写'
                    }],
                    detail: [{
                        required: true, message: '详细地址必须填写'
                    }]
                }
            }
        },
        created() {
            for (const key in area.province_list) {
                if (area.province_list[key] === options.district[0]) {
                    this.entity.district.push(key)
                    break
                }
            }
            for (const key in area.city_list) {
                if (area.city_list[key] === options.district[1]) {
                    this.entity.district.push(key)
                    break
                }
            }
            for (const key in area.county_list) {
                if (area.county_list[key] === options.district[2]) {
                    this.entity.district.push(key)
                    break
                }
            }
        },
        methods: {
            onConfirmHandler() {
                let province = ''
                let city = ''
                let district = ''
                for (const key in area.province_list) {
                    if (key === this.entity.district[0]) {
                        province = area.province_list[key]
                        break
                    }
                }
                for (const key in area.city_list) {
                    if (key === this.entity.district[1]) {
                        city = area.city_list[key]
                        break
                    }
                }
                for (const key in area.county_list) {
                    if (key === this.entity.district[2]) {
                        district = area.county_list[key]
                        break
                    }
                }
                console.log(this.entity)
                this.$refs.entity.validate(valid => {
                    if (valid === false) {
                        return
                    }
                    this.loading = true
                    OrderService.updateAddress({
                        customAddress:{
                            province: province,
                            city: city,
                            district: district,
                            detail: this.entity.detail,
                            postCode: this.entity.postCode
                        },
                        orderNumber: this.orderNumber,
                        name: this.entity.name,
                        phone: this.entity.phone
                    }).then(res => {
                        this.loading = false
                        if (res.data.code === constant.serviceCode.success) {
                            options.onSucceed()
                            this.visible = false
                        } else {
                            options.onFailed(res.data.msg)
                        }
                    })
                })
            },
            onCancelHandler() {
                this.visible = false
            }
        }
    })
    order.$mount()
    document.body.appendChild(order.$el)
}
