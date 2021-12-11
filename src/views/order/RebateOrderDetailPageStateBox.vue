<template>
    <div class="p-box p-box-bg-white">
        <a-row type="flex" justify="space-between">
            <a-space>
                <template v-if="mode === constant.mode.exchange">
                    <div v-if="state === constant.state.approve"
                         class="state-box">
                        <h2 class="text">待买家退货</h2>
                    </div>
                    <div v-if="state === constant.state.delivery" class="state-box">
                        <h2 class="text">待商家发货</h2>
                    </div>
                    <div v-if="state === constant.state.confirm" class="state-box">
                        <h2 class="text">待买家收货</h2>
                    </div>
                    <div v-if="state === constant.state.complete" class="state-box state-complete">
                        <h2 class="text">换货成功</h2>
                    </div>
                </template>
                <template v-if="mode === constant.mode.exchangeRebate">
                    <div v-if="state === constant.state.approve"
                         class="state-box">
                        <h2 class="text">待买家退货</h2>
                    </div>
                    <div v-if="state === constant.state.delivery" class="state-box">
                        <h2 class="text">待商家退款</h2>
                    </div>
                    <div v-if="state === constant.state.confirm" class="state-box">
                        <h2 class="text">退款中</h2>
                    </div>
                    <div v-if="state === constant.state.complete" class="state-box state-complete">
                        <h2 class="text">退款退货成功</h2>
                    </div>
                </template>
                <template v-if="mode === constant.mode.rebate">
                    <div v-if="state === constant.state.approve"
                         class="state-box">
                        <h2 class="text">待商家退款</h2>
                    </div>
                    <div v-if="state === constant.state.confirm" class="state-box">
                        <h2 class="text">退款中</h2>
                    </div>
                    <div v-if="state === constant.state.complete" class="state-box state-complete">
                        <h2 class="text">退款成功</h2>
                    </div>
                </template>
                <div v-if="state === constant.state.apply" class="state-box">
                    <h2 class="text">待处理</h2>
                </div>
                <div v-if="state === constant.state.refuse" class="state-box state-close">
                    <h2 class="text">商家已拒绝</h2>
                </div>
                <div v-if="state === constant.state.cancel" class="state-box state-close">
                    <h2 class="text">已关闭</h2>
                </div>
                <div class="ml10" style="font-weight: 500;font-size: 16px;display: inline-block">
                    <span>售后编号</span>
                    <span class="ml10">{{serviceNumber}}</span>
                </div>
            </a-space>
            <a-space>
                <span>申请人：</span>
                <a>{{applyUser}}</a>
                <span>申请时间：</span>
                <span>{{getApplyDateStr}}</span>
            </a-space>
        </a-row>
        <div v-if="state === constant.state.apply" class="mt20">
            <span>请在</span>
            <span class="pl5 pr5" style="font-size: 18px;color:#F9B43A;font-weight: 500 ">{{getApplyDeadline}}</span>
            <span>内处理</span>
            <span>预期未处理，</span>
            <span>系统将自动同意售后申请</span>
        </div>
        <div v-if="state === constant.state.approve && (mode === constant.mode.exchangeRebate || mode === constant.mode.exchange)"
             class="mt20">
            <span>买家需在</span>
            <span class="pl5 pr5" style="font-size: 18px;color:#F9B43A;font-weight: 500 ">{{getApproveDeadline}}</span>
            <span>内退货</span>
            <span>预期未处理，</span>
            <span>售后请求将自动撤销</span>
        </div>
        <div v-if="state === constant.state.delivery && mode === constant.mode.exchangeRebate"
             class="mt20">
            <span class="font-bold font-size-13">买家已退货,商家需要在确认收到退货后，进行退款</span>
        </div>
        <div v-if="state === constant.state.delivery && mode === constant.mode.exchange"
             class="mt20">
            <span class="font-bold font-size-13">买家已退货,商家需要在确认收到退货后，尽快重新发货</span>
        </div>
        <div v-if="state === constant.state.confirm"
             class="mt20">
            <span>商家已发货，</span>
            <span>买家需要在，</span>
            <span class="pl5 pr5" style="font-size: 18px;color:#F9B43A;font-weight: 500 ">{{getApproveDeadline}}</span>
            <span>内确认收货，</span>
            <span>预期未处理，</span>
            <span>将自动收货</span>
        </div>
        <div v-if="state === constant.state.complete && mode === constant.mode.exchangeRebate"
             class="mt20">
            <span class="font-bold font-size-13">退款金额：</span>
            <span style="color: red;font-size: 20px">¥ {{rebatePrice.toDecimalString()}}</span>
        </div>
        <div class="tip-box mt20 pt20">
            <div>
                <span style="color: #ed6a0c;">系统提醒：</span>
                <ul v-if="mode === constant.mode.exchange" style="list-style: none">
                    <li class="gray-7">尚未发货，请同意买家的售后申请。</li>
                    <li class="gray-7">如已发货，请主动联系买家进行协商处理。</li>
                </ul>
                <ul v-if="mode === constant.mode.rebate || mode === constant.mode.exchangeRebate"
                    style="list-style: none">
                    <li class="gray-7">如通过“微信支付”付款订单 零钱退款2个小时内 银行卡3天内到账</li>
                    <li class="gray-7">如通过“支付宝支付”付款订单 余额支付2个小时内 银行卡3天内到账</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import constant from "../../common/constant"
import util from '../../common/common'

export default {
    name: "RebateOrderDetailPageStateBox",
    props: {
        order: Object
    },
    data() {
        return {
            constant: constant.rebateConstant,
            address: [],
            state: this.order.state,
            mode: this.order.serviceMode,
            rebatePrice: this.order.rebatePrice,
            serviceNumber: this.order.serviceNumber,
            applyUser: '18662530021',
            applyDate: this.order.createDate,
            approveDate: this.order.states[constant.rebateConstant.state.approve]
        }
    },
    computed: {
        getApplyDateStr() {
            return moment(this.applyDate).format('YYYY-MM-DD HH:mm:ss')
        },
        getApplyDeadline() {
            return this.getDeadline(this.applyDate)
        },
        getApproveDeadline() {
            return this.getDeadline(this.approveDate)
        }
    },
    methods: {
        getDeadline(date) {
            let nowTime = moment(new Date()).valueOf()
            let endTime = moment(date).add(7, 'day').valueOf()
            let deadline = endTime - nowTime
            return util.DateExtend.getDeadlineString(deadline)
        }
    }
}
</script>

<style scoped>

    .state-box {
        height: 40px;
        background: linear-gradient(90deg, #4f8aef, #1d61d6);
        display: inline-block;
        padding: 10px 22px 10px 15px;
        box-sizing: border-box;
        position: relative;
    }

    .state-close {
        background: linear-gradient(90deg, #b3b7bf, #a7aab2);
    }

    .state-complete {
        background: linear-gradient(90deg, #fdc969, #f8af32);
    }

    .state-box .text {
        line-height: 20px;
        color: white;
    }

    .state-box:after {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        border-color: transparent #fff transparent transparent;
        border-style: solid;
        border-width: 20px 6px;
    }

    .tip-box {
        border-top: 1px solid #ebedf0;
    }
</style>
