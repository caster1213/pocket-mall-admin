<template>
    <a-modal :visible="visible" :confirm-loading="loading" @ok="onConfirm" @cancel="onClose" :cancelText="cancelBtnText"  title="标记">
        <a-row>
            <a-col span="3">
                <span class="font-size-12">标记</span>
            </a-col>
            <a-col span="20">
                <p-market-select @change="onChange" :default-value="marker" size="18px"></p-market-select>
            </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
            <a-col span="3">
                <span class="font-size-12">标记信息</span>
            </a-col>
            <a-col span="20">
                <a-textarea style="height: 100px" placeholder="200个字以内" v-model="message"></a-textarea>
            </a-col>
        </a-row>
    </a-modal>
</template>

<script>
export default {
    name: "OrderUpdateMarket"
}
</script>

<style scoped>

</style>
