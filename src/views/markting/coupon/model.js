import constant from "../../../common/constant";
import pattern from "../../../common/pattern";


class Coupon {
    constructor() {
        this.name = ''
        this.label = ''
        this.type = ''
        this.count = ''
        this.productScopeType = constant.activityProductScopeType.all
        this.threshold = constant.couponThresholdType.all
        this.expireType = constant.couponExpireType.range
        this.isSuperposition = false
        this.receiveLimitType = 0
        this.receiveCount = ''
        this.isExpireNotice = false
        this.expireNotice = ''
    }
}

let rules = {
    name: [{
        required: true, message: '必须填写优惠券名称',
    }, {
        max: 10, message: '优惠券名称最长10位'
    }],
    label: [{
        max: 10, message: '备注名称最长10位'
    }],
    count: [{
        required: true, message: '必须填写发放总量',
    }, {
        pattern: pattern.decimal0, message: '请输入正确的数字'
    }, {
        validator: (rule, value, callback) => {
            if (parseInt(value) > 1000000) {
                callback('发放总量最多为1000000')
            } else {
                callback()
            }
        }
    }]
}

let columns = [{
    title: '优惠券名称'
}, {
    title: '名称备注'
}, {
    title: '类型'
}, {
    title: '优惠内容'
}, {
    title: '状态'
}, {
    title: '已领取'
}, {
    title: '剩余'
}, {
    title: '已使用'
}, {
    title: '支付金额(元)'
}, {
    title: '操作'
}]

export {
    Coupon,
    columns,
    rules
}
