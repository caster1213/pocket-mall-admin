/**
 * 商品选择范围
 * @type {{all: number, product: number, group: number}}
 */
let activityProductScopeType = {
  all: 0,//全部
  product: 1,//商品
  group: 2//分组
}


export default {
  /**
   * 运费计价类型
   */
  freightChargeType: {
    /**
     * 件数
     */
    number: 1,
    /**
     * 重量
     */
    weight: 2,
    /**
     * 体积
     */
    volume: 3
  },
  /**
   * 运费类型
   */
  freightType: {
    /**
     * 买家
     */
    buy: 1,
    /**
     * 卖家
     */
    sell: 2
  },
  /**
   * 服务端接口Code说明
   */
  serviceCode: {
    /**
     * 接口成功返回
     */
    success: 0
  },
  rowUpdateStatus: {
    /**
     * 添加
     */
    add: 1,
    /**
     * 删除
     */
    del: 3,
    /**
     * 更新
     */
    update: 2
  },
  customDeliveryTimeOption: {
    fixed: 1,
    time: 2
  },
  /**
   * 配送模式
   */
  freightModel: {
    /**
     * 商家配送
     */
    merchantFreight: 1,
    /**
     * 自提
     */
    sendFreight: 2
  },
  /**
   * 订单标记
   */
  orderMarket: {
    red: 1,
    yellow: 2,
    green: 3,
    blue: 4,
    violet: 5,
    grey: 0
  },
  orderState: {
    notPay: 1,
    payment: 2,
    delivery: 3,
    confirm: 4,
    complete: 5,
    cancel: -1,
    overTimeCancel: -11,
    close: -2,
    overtimeClose: -3,
  },
  orderPayType: {
    empty: -1,
    free: 0,
    wxPay: 1,
    balance: 2,
    aliPay: 3
  },
  week: {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
    options: [{
      label: '星期一',
      value: 1
    }, {
      label: '星期二',
      value: 2
    }, {
      label: '星期三',
      value: 3
    }, {
      label: '星期四',
      value: 4
    }, {
      label: '星期五',
      value: 5
    }, {
      label: '星期六',
      value: 6
    }, {
      label: '星期日',
      value: 7,
    }]
  },
  rebateConstant: {
    mode: {
      rebate: 1,
      exchange: 2,
      exchangeRebate: 3,
      options: [{label: '仅退款', value: 1}, {label: '换货', value: 2}, {label: '退货退款', value: 3}]
    },
    state: {
      apply: 1,
      approve: 2,
      delivery: 3,
      confirm: 4,
      complete: 0,
      refuse: -2,
      cancel: -1,
      close: -3
    }
  },
  /**
   * 对象的变更状态
   */
  entityModifyStatus: {
    add: 1,
    update: 2,
    delete: 3
  },

  memberDiscountType: {
    discount: 1,
    sub: 2,
    target: 3
  },
  productStatus: {
    now: 1
  },
  activityProductScopeType,
  couponType: {
    reward: 1,
    discount: 2,
    reduction: 3,
    freight: 4
  },
  couponThresholdType: {
    all: 1,
    orderPriceMax: 2,
    orderCountMax: 3
  },
  couponExpireType: {
    range: 1,
    now: 2,
    delay: 3
  },
  couponReceiveLimitType: {
    all: 1,
    target: 2
  },
  couponReceiveCountType: {
    all: 1,
  },
  pointCommonRule: {
    pointName: 'Point.Name',
    pointDailyLimit: 'Point.Daily.Limit',
    pointExchange: 'Point.Exchange',
    pointDeduction: 'Point.Deduction',
    pointExpire: 'Point.Expire',
  },
  pointCustomRuleType: {
    saleAmount: 2,
    saleAmountRate: 3
  },
  activityType: {
    groupBuy: 1,
    pointExchange: 2
  },
  productGroup: {
    style: {
      max: 1,
      min: 2,
      minix: 3,
      detail: 4
    },
    btnStyle: {
      style1: 1,
      style2: 2,
      style3: 3
    },
    sort: {
      number: 1,
      sale: 2,
      dateDesc: 3,
      dateAsc: 4
    }
  }
}

