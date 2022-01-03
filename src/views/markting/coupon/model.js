import constant from '../../../common/constant';
import pattern from '../../../common/pattern';


class Coupon {
  constructor() {
    this.id = 0
    this.name = ''
    this.label = ''
    this.type = ''
    this.count = ''
    this.productScopeType = constant.activityProductScopeType.all
    this.threshold = constant.couponThresholdType.all
    this.expireType = constant.couponExpireType.range
    this.isSuperposition = false
    this.receiveLimitType = constant.couponReceiveLimitType.all
    this.receiveCount = ''
    this.isReceiveCount = true
    this.isExpireNotice = false
    this.expireNotice = ''

    this.thresholdOrderPriceValue = ''
    this.thresholdOrderCountValue = ''
    this.discountValue = ''
    this.isMaxDiscountValue = false
    this.maxDiscountValue = ''
    this.expireDate = []
    this.expireDay = ''
    this.delayDay = ''
    this.receiveDay = ''
    this.goodsSelectRows = []
    this.goodsGroupSelectRows = []
    this.freeLevel = []
    this.chargeLevel = []

    this.rules = {
      threshold: {
        error: false,
        message: ''
      },
      expireDate: {
        error: false,
        message: ''
      },
      discount: {
        error: false,
        message: ''
      },
      productScope: {
        error: false,
        message: ''
      },
      level: {
        error: false,
        message: ''
      }
    }
  }

  orderPriceValid() {
    if (this.threshold === constant.couponThresholdType.orderPriceMax) {
      if (pattern.decimal2.test(this.thresholdOrderPriceValue) === false) {
        this.rules.threshold.error = true
        this.rules.threshold.message = '请输入正确的数字'
        return
      }
      if (parseFloat(this.thresholdOrderPriceValue) > 100000) {
        this.rules.threshold.error = true
        this.rules.threshold.message = '金额请勿超出100000'
        return
      }
    }
    this.rules.threshold.error = false
  }

  expireValid() {
    if (this.expireType === constant.couponExpireType.range) {
      if (this.expireDate.length === 0) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入用券时间'
        return
      }
    } else if (this.expireType === constant.couponExpireType.now) {
      if (pattern.decimal0.test(this.expireDay) === false) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
      if (parseInt(this.expireDay) > 1000) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
    } else if (this.expireType === constant.couponExpireType.delay) {
      if (pattern.decimal0.test(this.delayDay) === false) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
      if (pattern.decimal0.test(this.receiveDay) === false) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
      if (parseInt(this.expireDay) > 1000) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
      if (parseInt(this.receiveDay) > 1000) {
        this.rules.expireDate.error = true
        this.rules.expireDate.message = '请输入1~1000之间的整数'
        return
      }
    }
    this.rules.expireDate.error = false
  }

  discountValid() {
    if (this.type === constant.couponType.discount) {
      if (pattern.decimal2.test(this.discountValue) === false) {
        this.rules.discount.error = true
        this.rules.discount.message = '优惠券折扣必须大于等于1, 且最大不能超过9.9'
        return
      }
      if (parseFloat(this.discountValue) >= 10 || parseFloat(this.discountValue) < 1) {
        this.rules.discount.error = true
        this.rules.discount.message = '优惠券折扣必须大于等于1, 且最大不能超过9.9'
        return
      }
    } else {
      if (pattern.decimal2.test(this.discountValue) === false) {
        this.rules.discount.error = true
        this.rules.discount.message = '优惠券面值必须大于等于 0.01 元, 且最大不能超过100000元'
        return
      }
      if (parseFloat(this.discountValue) >= 100000 || parseFloat(this.discountValue) < 0.01) {
        this.rules.discount.error = true
        this.rules.discount.message = '优惠券面值必须大于等于 0.01 元, 且最大不能超过100000元'
        return
      }
    }

    this.rules.discount.error = false

  }

  productScopeValid() {
    if (this.productScopeType === constant.activityProductScopeType.product) {
      if (this.goodsSelectRows.length === 0 || this.goodsGroupSelectRows.length === 0) {
        this.rules.productScope.error = true
        this.rules.productScope.message = '请选择适用商品'
        return
      }
    }
    this.rules.productScope.error = false
  }

  levelValid() {
    if (this.receiveLimitType === constant.couponReceiveLimitType.target) {
      if (this.chargeLevel.length === 0 && this.freeLevel.length === 0) {
        this.rules.level.error = true
        this.rules.level.message = '请选择适请选择用户身份用商品'
        return
      }
    }
    return this.rules.level.error = false
  }


  valid() {
    this.orderPriceValid()
    this.expireValid()
    this.discountValid()
    this.productScopeValid()
    this.levelValid()

    if (this.isExpireNotice) {
      return this.expireNotice.toString().length > 0
    }

    return this.rules.level.error === false
      && this.rules.productScope.error === false
      && this.rules.threshold.error === false
      && this.rules.discount.error === false
      && this.rules.expireDate.error === false
  }


  to() {
    let obj = {
      id: this.id,
      name: this.name,
      type: this.type,
      label: this.label,
      count: this.count,
      activityProductRange: this.productScopeType,
      couponUseThreshold: this.threshold,
      discountAmount: 0,
      maxDiscountAmount: 0,
      maxOrderPriceThreshold: 0,
      maxOrderCountThreshold: 0,
      expireType: this.expireType,
      expireDay: 0,
      delayDay: 0,
      expireStartDate: '1990-01-01',
      expireEndDate: '1990-01-01',
      isCover: this.isSuperposition,
      expireNoticeDay: 0,
      receiveCount: 0,
      isSelectUserLevel: false
    }
    if (obj.couponUseThreshold === constant.couponThresholdType.orderPriceMax) {
      obj.maxOrderPriceThreshold = parseFloat(this.thresholdOrderPriceValue)
    }
    if (obj.couponUseThreshold === constant.couponThresholdType.orderCountMax) {
      obj.maxOrderCountThreshold = parseFloat(this.thresholdOrderCountValue)
    }
    obj.discountAmount = parseFloat(this.discountValue)
    if (this.isMaxDiscountValue) {
      obj.maxDiscountAmount = parseFloat(this.maxDiscountValue)
    }
    if (obj.expireType === constant.couponExpireType.range) {
      obj.expireStartDate = this.expireDate[0].format('YYYY-MM-DD HH:mm:ss')
      obj.expireEndDate = this.expireDate[1].format('YYYY-MM-DD HH:mm:ss')
    }
    if (obj.expireType === constant.couponExpireType.now) {
      obj.expireDay = parseInt(this.expireDay)
    }
    if (obj.expireType === constant.couponExpireType.delay) {
      obj.delayDay = parseInt(this.receiveDay)
      obj.expireDay = parseInt(this.delayDay)
    }
    obj.expireType = this.expireType
    obj.isSelectUserLevel = this.receiveLimitType === constant.couponReceiveLimitType.target
    if (this.receiveLimitType === constant.couponReceiveLimitType.all) {
      obj.receiveCount = parseInt(this.receiveCount)
    }
    if (this.isExpireNotice) {
      obj.expireNoticeDay = this.expireNotice
    }
    return {
      coupon: obj,
      freeLevel: this.freeLevel.map(ele => ele.level),
      chargeLevel: this.chargeLevel.map(ele => ele.level),
      products: this.goodsSelectRows.map(ele => {
        return {
          productId: ele.id,
          skuId: -1
        }
      }),
      productGroups: this.goodsGroupSelectRows.map(ele => ele.id)
    }
  }

  from(value) {
    this.id = value.id
    this.name = value.name
    this.type = value.type
    this.count = value.count
    this.discountValue = value.discountAmount
    this.maxDiscountValue = value.maxDiscountAmount
    this.isMaxDiscountValue = value.maxDiscountAmount > 0
    this.threshold = value.couponUseThreshold
    this.thresholdOrderPriceValue = value.maxOrderPriceThreshold
    this.thresholdOrderCountValue = value.maxOrderCountThreshold
    this.expireType = value.expireType
    this.expireNotice = value.expireNoticeDay
    this.isExpireNotice = value.expireNoticeDay > 0
    this.isReceiveCount = !value.receiveCount > 0
    this.receiveCount = value.receiveCount
    this.receiveLimitType = value.isSelectUserLevel ? constant.couponReceiveLimitType.target : constant.couponReceiveLimitType.all
    if (value.expireType === constant.couponExpireType.range) {
      this.expireDate = [value.expireStartDate, value.expireEndDate]
    } else {
      this.expireDate = []
    }
    if (value.expireType === constant.couponExpireType.now) {
      this.expireDay = value.expireDay
    }
    if (value.expireType === constant.couponExpireType.delay) {
      this.delayDay = value.delayDay
      this.receiveDay = value.expireDay
    }
    if (this.receiveCount === 0) {
      this.receiveCount = ''
    }
    if (this.expireNotice === 0) {
      this.expireNotice = ''
    }
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
