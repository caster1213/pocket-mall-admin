<template>
    <div>
        <div>
            <span v-if="orderState === 1">等待买家付款</span>
            <div style="margin-top: 10px" v-if="orderState === 1">
                <a-button @click="handleCancelEvent" class="font-size-12">取消订单</a-button>
            </div>
            <span v-if="orderState === 2">{{deliveryStatusText}}</span>
            <div style="margin-top: 10px" v-if="orderState === 2">
                <a-button v-if="isSendFreight === false" type="primary" @click="handleDeliveryEvent()" ghost
                          class="font-size-12">发货
                </a-button>
                <a-button v-else type="primary" @click="handleDeliveryEvent()" ghost
                          class="font-size-12">核销
                </a-button>
            </div>
            <span v-if="orderState === 3">已发货，待收货</span>
            <span v-if="orderState === 4">已确认收货</span>
            <span v-if="orderState === 5">交易完成</span>
            <span v-if="orderState === -1">用户取消支付</span>
            <span v-if="orderState === -2">已关闭</span>
            <span v-if="orderState === -3">订单超时，已关闭</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrderStateBox",
    props: {
        orderGenre: Number,
        orderState: Number,
        isSendFreight: Boolean
    },
    computed: {
        deliveryStatusText() {
            if (this.orderState === 2 && this.isSendFreight) {
                return '已支付，待核销'
            } else {
                return '已支付，未发货'
            }
        }
    },
    methods: {
        handleDeliveryEvent() {
            this.$emit('delivered')
        },
        handleCancelEvent() {
            this.$emit('cancel')
        }
    }
}
</script>

<style scoped>

</style>
