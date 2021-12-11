<template>
    <div style="padding-left: 50px;padding-right: 50px" class="p-box p-box-bg-white order-step">
        <a-steps size="small"  :current="current" :status="getStatus">
            <a-step v-for="(step,index) in steps" :key="index" :title="step.title" :description="step.date"/>
        </a-steps>
    </div>
</template>

<script>
import constant from "../common/constant"
import moment from 'moment'

export default {
    name: "OrderStepFlow",
    props: {
        stateFlows: Array,
        orderState: Number
    },
    data() {
        return {
            current: 0,
            steps: []
        }
    },
    watch: {
        'stateFlows': {
            handler() {
                this.steps = []
                if (this.stateFlows.length === 0) {
                    return
                }
                if (this.stateFlows[this.stateFlows.length - 1].orderState < 0) {
                    for (const step of this.stateFlows) {
                        this.steps.push({
                            title: this.getOrderStateText(step.orderState),
                            value: step.orderState,
                            status: 'error',
                            data: moment(step.createDate).format('YYYY-MM-DD HH:mm:ss')
                        })
                    }
                } else {
                    this.steps.push({title: '买家下单', date: '', value: constant.orderState.notPay})
                    this.steps.push({title: '买家付款', date: '', value: constant.orderState.payment})
                    this.steps.push({title: '商家发货', date: '', value: constant.orderState.delivery})
                    this.steps.push({title: '确认收货', date: '', value: constant.orderState.confirm})
                    this.steps.push({title: '已评论', date: '', value: 5})
                    for (const step of this.steps) {
                        let s = this.stateFlows.find(x => x.orderState === step.value)
                        if (s === undefined) continue
                        step.date = moment(s.createDate).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
                this.current = this.steps.findIndex(x => x.value === this.orderState)
                console.log(this.stateFlows)
            },
            immediate: true
        }
    },
    computed: {
        getStatus() {
            if (this.steps.length === 0) return 'process'
            if (this.steps[this.steps.length - 1].value > 0) {
                return 'process'
            }else{
                return 'error'
            }
        }
    },
    methods: {
        getOrderStateText(state) {
            if (state === constant.orderState.notPay)
                return '买家下单'
            if (state === constant.orderState.payment)
                return '买家付款'
            if (state === constant.orderState.delivery)
                return '商家发货'
            if (state === constant.orderState.confirm)
                return '确认收货'
            if (state === constant.orderState.cancel)
                return '订单取消'
            if (state === constant.orderState.close)
                return '订单关闭'
        }
    }
}
</script>

<style scoped>
    .order-step /deep/ .ant-steps-item-finish .ant-steps-item-title {
        font-size: 14px;
        color: #9797a1;
        font-weight: 700;
    }

    .order-step /deep/ .ant-steps-item-finish .ant-steps-item-description {
        font-size: 12px;
        color: #9797a1;
    }

    .order-step /deep/ .ant-steps-item-active .ant-steps-item-title {
        font-size: 14px;
        font-weight: 700;
    }

    .order-step /deep/ .ant-steps-item-active .ant-steps-item-description {
        font-size: 12px;
        color: #595961;
    }

    .order-step /deep/ .ant-steps-item-wait .ant-steps-item-title {
        font-size: 14px;
        font-weight: 700;
        color: #9797a1;
    }

    .order-step /deep/ .ant-steps-item-wait .ant-steps-item-description {
        font-size: 12px;
        color: #9797a1;
    }
</style>
