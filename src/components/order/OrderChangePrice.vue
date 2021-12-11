<template>
    <div v-if="visible">
        <a-modal width="1000px" :confirm-loading="loading" :visible="visible" @ok="onConfirm" @cancel="onCancel" title="价格修改">
            <p-order-item @priceChange="onPriceChange" @freightPriceChange="onFreightPriceChange" :order-items="orderItems" :is-change-price="true" :freight-options="{
                freightPrice:freightPrice,
                freightChangePrice:freightChangePrice,
                freightDiscountPrice1:0,
                freightDiscountPrice2:0,
            }"></p-order-item>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: "OrderChangePrice"
}
</script>

<style scoped>
</style>
