import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)
let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home'),
            meta: {key: ''},
            redirect: {path: '/dashboard'},
            children: [{
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: {key: '0-1', depth: 0, name: '首页'}
            }, {
                path: '/decorate/home',
                name: 'decorate.hone',
                component: () => import('../views/store/HomeSetting'),
                meta: {depth: 1, key: 101, name: '店铺主页'}
            }, {
                path: '/users',
                name: 'users',
                component: () => import('../views/user/UserList'),
                meta: {depth: 1, key: 40101, name: '用户查询'}
            }, {
                path: '/users/detail',
                name: 'user.detail',
                component: () => import('../views/user/UserDetailPage'),
                meta: {depth: 2, key: 40101011, name: '客户详情'}
            }, {
                path: '/user/level',
                name: 'user.level',
                component: () => import('../views/user/UserLevelPage'),
                meta: {depth: 1, key: 40103, name: '等级管理'}
            }, {
                path: '/user/level/config',
                name: 'user.level.config',
                component: () => import('../views/user/UserLevelConfigUpdatePage'),
                meta: {depth: 2, key: 40103, name: '等级编辑'}
            }, {
                path: '/user/point/rule',
                name: 'user.point.rule',
                component: () => import('../views/user/PointRulePage'),
                meta: {depth: 1, key: 40104, name: '积分权益'}
            }, {
                path: '/user/point/tx',
                name: 'user.point.tx',
                component: () => import('../views/user/PointTxPage'),
                meta: {depth: 2, key: 40104, name: '积分明细'}
            }, {
                path: '/user/point/rule/add',
                name: 'user.point.rule.add',
                component: () => import('../views/user/PointRuleAddPage'),
                meta: {depth: 2, key: 40104, name: '新建积分规则'}
            }, {
                path: '/user/tree',
                name: 'user.tree',
                component: () => import('../views/user/UserTree'),
                meta: {depth: 1, key: 0, name: '关系图谱'}
            }, {
                path: '/finance/withdraw',
                name: 'finance-withdraw',
                component: () => import('../views/user/Withdrawal'),
                meta: {depth: 1, key: 50101, name: '提现审核'}
            }, {
                path: '/finance/cost/goods',
                name: 'finance-cost-goods',
                component: () => import('../views/finance/GoodsCostCount'),
                meta: {depth: 1, key: 50102, name: '货款统计'}
            }, {
                path: '/finance/payment',
                name: 'finance-payment',
                component: () => import('../views/finance/DailyPaymentCount'),
                meta: {depth: 1, key: 50103, name: '每日收款'}
            }, {
                path: '/transaction',
                name: 'transaction',
                component: () => import('../views/user/Transaction'),
                meta: {depth: 1, key: 40102, name: '收益明细'}
            }, {
                path: '/orders',
                name: 'orders',
                component: () => import('../views/order/OrderPage'),
                meta: {depth: 1, key: 10101, name: '全部订单'}
            }, {
                path: '/order/detail',
                name: 'order.detail',
                component: () => import('../views/order/OrderDetailPage'),
                meta: {depth: 2, key: 1010111, name: '订单详情'}
            }, {
                path: '/order/rebate/amount',
                name: 'order.rebate.amount',
                component: () => import('../views/order/OrderRebateAmountHistoryPage'),
                meta: {depth: 2, key: 1010212, name: '退款详情'}
            }, {
                path: '/order/delivery/bulk',
                name: 'order.delivery.bulk',
                component: () => import('../views/order/OrderDeliveryBulk'),
                meta: {depth: 1, key: 10103, name: '批量发货'}
            }, {
                path: '/order/delivery/import',
                name: 'order.delivery.import',
                component: () => import('../views/order/OrderDeliveryUploadPage'),
                meta: {depth: 2, key: 1010311, name: '上传模板'},
            }, {
                path: '/order/express',
                name: 'order.express',
                component: () => import('../views/order/OrderExpressPage'),
                meta: {depth: 1, key: 0, name: '发货处理'}
            }, {
                path: '/order/express/site',
                name: 'order.express.site',
                component: () => import('../views/order/OrderSiteExpressPage'),
                meta: {depth: 1, key: 0, name: '自提处理'}
            }, {
                path: '/order/aftermarket',
                name: 'order.aftermarket',
                component: () => import('../views/order/OrderAftermarketPage'),
                meta: {depth: 1, key: 10102, name: '售后处理'}
            }, {
                path: '/rebate',
                name: 'rebate',
                component: () => import('../views/order/RebateList'),
                meta: {depth: 1, key: 0, name: '退款处理'}
            }, {
                path: '/rebate/detail',
                name: 'rebate.detail',
                component: () => import('../views/order/RebateOrderDetailPage'),
                meta: {depth: 2, key: 1010211, name: '售后详情'}
            }, {
                path: '/config/business',
                name: 'field',
                component: () => import('../views/sys/FieldConfig'),
                meta: {depth: 1, key: 0, name: '参数配置'}
            }, {
                path: '/banner/list',
                name: 'field',
                component: () => import('../views/sys/Banner'),
                meta: {depth: 1, key: 70101, name: '轮播图'}
            }, {
                path: '/material',
                name: 'material',
                component: () => import('../views/markting/Material'),
                meta: {depth: 1, key: 70102, name: '素材中心'}
            }, {
                path: '/marketing/notice',
                name: 'marketing.notice',
                component: () => import('../views/markting/Notice'),
                meta: {depth: 1, key: 0, name: '消息推送'}
            }, {
                path: '/marketing/redenvelope',
                name: 'marketing.redenvelope',
                component: () => import('../views/markting/RedEnvelope'),
                meta: {depth: 1, key: 0, name: '红包活动'}
            }, {
                path: '/marketing/spell/page',
                name: 'marketing.spell.page',
                component: () => import('../views/markting/spell/SpellGroupPage'),
                meta: {depth: 1, key: 70103, name: '多人拼团'}
            }, {
                path: '/marketing/spell/page/add',
                name: 'marketing.spell.page.add',
                component: () => import('../views/markting/spell/SpellGroupAddPage'),
                meta: {depth: 2, key: 7010301, name: '添加活动'}
            }, {
                path: '/marketing/spell/page/update',
                name: 'marketing.spell.page.update',
                component: () => import('../views/markting/spell/SpellGroupUpdatePage'),
                meta: {depth: 2, key: 7010305, name: '编辑活动'}
            }, {
                path: '/marketing/spell/user/page',
                name: 'marketing.spell.user.page',
                component: () => import('../views/markting/spell/SpellUserHistoryPage'),
                meta: {depth: 3, key: 7010302, name: '参与记录'}
            }, {
                path: '/marketing/spell/data',
                name: 'marketing.spell.data',
                component: () => import('../views/markting/spell/SpellDataCountPage'),
                meta: {depth: 1, key: 60102, name: '拼团数据'}
            }, {
                path: '/marketing/spell/product/add',
                name: 'marketing.spell.product.add',
                component: () => import('../views/markting/spell/SpellProductAddPage'),
                meta: {depth: 2, key: 70103, name: '添加商品'}
            }, {
                path: '/marketing/spell/product/list',
                name: 'marketing.spell.product.list',
                component: () => import('../views/markting/spell/SpellProductListPage'),
                meta: {depth: 2, key: 7010303, name: '管理商品'}
            }, {
                path: '/marketing/package/page',
                name: 'marketing.package.page',
                component: () => import('../views/markting/package/PackageDiscountActivityPage'),
                meta: {depth: 1, key: 70105, name: '优惠套餐'}
            }, {
                path: '/marketing/package/page/add',
                name: 'marketing.package.page.add',
                component: () => import('../views/markting/package/PackageDiscountActivityAddPage'),
                meta: {depth: 2, key: 70105, name: '添加套餐'}
            }, {
                path: '/marketing/coupon',
                name: 'marketing.coupon',
                component: () => import('../views/markting/coupon/CouponPage'),
                meta: {depth: 1, key: 70104, name: '优惠券'}
            }, {
                path: '/marketing/coupon/add',
                name: 'marketing.coupon/add',
                component: () => import('../views/markting/coupon/AddCouponPage'),
                meta: {depth: 2, key: 70104, name: '新建优惠券'}
            }, {
                path: '/marketing/sign',
                name: 'marketing.sign',
                component: () => import('../views/markting/sign/SignInActivityPage'),
                meta: {depth: 1, key: 70106, name: '签到有礼'}
            }, {
                path: '/marketing/lottery',
                name: 'marketing.lottery',
                component: () => import('../views/markting/luckyLottery/LuckyLotteryPage'),
                meta: {depth: 1, key: 70107, name: '幸运抽奖'}
            }, {
                path: '/marketing/lottery/add',
                name: 'marketing.lottery.add',
                component: () => import('../views/markting/luckyLottery/AddLuckyLotteryPage'),
                meta: {depth: 2, key: 70107, name: '创建活动'}
            }, {
                path: '/marketing/point',
                name: 'marketing.point',
                component: () => import('../views/markting/pointExchange/PointExchangePage'),
                meta: {depth: 1, key: 70108, name: '积分兑换'}
            }, {
                path: '/marketing/point/add',
                name: 'marketing.point/add',
                component: () => import('../views/markting/pointExchange/AddPointExchangeActivity'),
                meta: {depth: 2, key: 70108, name: '新建活动'}
            }, {
                path: '/marketing/limitdiscount',
                name: 'marketing.limitdiscount',
                component: () => import('../views/markting/limitDiscount/LimitDiscountPage'),
                meta: {depth: 1, key: 70109, name: '限时折扣'}
            }, {
                path: '/marketing/limitdiscount/add',
                name: 'marketing.limitdiscount.add',
                component: () => import('../views/markting/limitDiscount/AddLimitDiscountPage'),
                meta: {depth: 1, key: 70109, name: '新建活动'}
            }, {
                path: '/marketing/redenvelope/history',
                name: 'marketing.redenvelope.history',
                component: () => import('../views/markting/RedEnvelopeHistory'),
                meta: {depth: 2, key: 0, name: '红包历史'}
            }, {
                path: '/product',
                name: 'product',
                component: () => import('../views/product/ProductListPage'),
                meta: {depth: 1, key: 2010110, name: '商品查询'}
            }, {
                path: '/product/add',
                name: 'product.add',
                component: () => import('../views/product/AddProductPage'),
                meta: {depth: 2, key: 201011010, name: '发布商品'}
            }, {
                path: '/product/update',
                name: 'product.update',
                component: () => import('../views/product/UpdateProductPage'),
                meta: {depth: 2, key: 201011011, name: '修改商品'}
            }, {
                path: '/product/group',
                name: 'product.group',
                component: () => import('../views/product/Group'),
                meta: {depth: 1, key: 2010112, name: '商品分组'}
            }, {
                path: '/product/group/edit',
                name: 'product.group.edit',
                component: () => import('../views/product/ProductGroupEditPage'),
                meta: {depth: 2, key: 2010112, name: '创建分组'}
            }, {
                path: '/product/category',
                name: 'product.category',
                component: () => import('../views/product/Category'),
                meta: {depth: 1, key: 2010111, name: '商品类目'}
            }, {
                path: '/setting/delivery',
                name: 'setting.delivery',
                component: () => import('../views/setting/delivery/DeliverySetting'),
                children: [{
                    path: '/setting/delivery/merchant',
                    name: 'setting.delivery.merchant',
                    component: () => import('../views/setting/delivery/FreightPage'),
                    meta: {key: 801011}
                }, {
                    path: '/setting/delivery/custom',
                    name: 'setting.delivery.custom',
                    component: () => import('../views/setting/delivery/CustomPage'),
                    meta: {key: 801012}
                }, {
                    path: '/setting/delivery/address',
                    name: 'setting.delivery.address',
                    component: () => import('../views/setting/delivery/AddressStorePage'),
                    meta: {key: 801013}
                }],
                meta: {depth: 1, key: 80101, name: '配送设置'}
            }, {
                path: '/setting/delivery/custom/add',
                name: 'setting.delivery.custom.add',
                component: () => import('../views/setting/delivery/AddCustomSitePage'),
                meta: {depth: 2, key: 80101211, name: '新增自提站点'}
            }, {
                path: '/setting/delivery/custom/update',
                name: 'setting.delivery.custom.update',
                component: () => import('../views/setting/delivery/UpdateCustomSitePage'),
                meta: {depth: 2, key: 80101212, name: '编辑自提站点'}
            }, {
                path: '/setting/delivery/freight/template/add',
                name: 'addFreightTemplate',
                component: () => import('../views/setting/delivery/AddFreightTemplate'),
                meta: {depth: 2, key: 80101111, name: '添加模板'}
            }, {
                path: '/setting/delivery/freight/template/update',
                name: 'updateFreightTemplate',
                component: () => import('../views/setting/delivery/UpdateFreightTemplate'),
                meta: {depth: 2, key: 80101112, name: '编辑模板'}
            }, {
                path: '/employee',
                name: 'employee',
                component: () => import('../views/employee/EmployeePage'),
                meta: {depth: 1, key: 80102, name: '员工管理'}
            }, {
                path: '/role',
                name: 'role',
                component: () => import('../views/employee/RolePage'),
                meta: {depth: 1, key: 80103, name: '角色管理'}
            }, {
                path: '/data/download',
                name: 'data-download',
                component: () => import('../views/data/DownloadPage'),
                meta: {depth: 1, key: 60101, name: '下载中心'}
            }, {
                path: '/error/404',
                name: '404',
                component: () => import('../views/error/NotFound'),
                meta: {key: 0}
            }, {
                path: '/error/500',
                name: '500',
                component: () => import('../views/error/Error'),
                meta: {key: 0}
            }, {
                path: '/error/403',
                name: '403',
                component: () => import('../views/error/NotPermission'),
                meta: {key: 0}
            }]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        }
    ]
})

router.beforeEach((to, form, next) => {
    if (store.state.token === '' || store.state.token === null) {
        if (to.path !== '/login') {
            next({path: '/login'})
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next('/')
        } else {
            if (to.path === '/error/403' || to.path === '/error/404' || to.path === '/error/500') {
                next()
                return
            }
            if (to.path === '/dashboard') {
                next()
                return
            }
            if (store.state.menus.filter(x => x.id === to.meta.key).length === 0) {
                next({path: '/error/403'})
                return
            }
            if (to.matched.length === 0) {
                next('/error/404')
            } else {
                next()
            }
            /*if (to.meta.hasOwnProperty('roles') && to.meta.roles.length === 0) {
                next()
            } else if (to.meta.hasOwnProperty('roles') && to.meta.roles.findIndex(x => x === store.state.role) < 0) {
                next({path: '/error/403'})
            } else {
                if (to.matched.length === 0) {
                    next('/error/404')
                } else {
                    next()
                }
            }*/
        }
    }
})

export default router
