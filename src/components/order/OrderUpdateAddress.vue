<template>
    <a-modal :visible="visible" :confirm-loading="loading" @cancel="onCancelHandler" @ok="onConfirmHandler" title="修改收货地址">
        <a-form-model  ref="entity" :model="entity" :rules="rules" :labelCol="{span:4}" :wrapperCol="{span:15}">
            <a-form-model-item required label="收件人姓名" prop="name">
                <a-input class="font-size-12" v-model="entity.name"></a-input>
            </a-form-model-item>
            <a-form-model-item required label="收件人电话" prop="phone">
                <a-input class="font-size-12" v-model="entity.phone"></a-input>
            </a-form-model-item>
            <a-form-model-item required label="收件人地址" prop="district">
                <p-district-select v-model="entity.district"></p-district-select>
            </a-form-model-item>
            <a-form-model-item required label="详细地址" prop="detail">
                <a-input v-model="entity.detail"></a-input>
            </a-form-model-item>
            <a-form-model-item label="邮政编码">
                <a-input class="font-size-12" v-model="entity.postCode"></a-input>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
export default {
    name: "OrderUpdateAddress"
}
</script>

<style scoped>

</style>
