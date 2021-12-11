<template>
    <a-modal title="售后处理" :visible="isShow" :confirm-loading="loading" @ok="onConfirm" @cancel="onCancel"
             :ok-text="confirmBtnText">
        <div class="font-size-12">
            <div style="margin-top: -20px;" class="mb10">
                <a-alert class="font-size-12" banner type="warning"
                         message="建议你与买家协商后，再确定是否拒绝售后。如你拒绝后，买家可修改售后申请协议重新发起售后。"/>
            </div>
            <div class="mb10">
                <a-space>
                    <label>售后方式：</label>
                    <span>{{mode}}</span>
                </a-space>
            </div>
            <div class="mb10">
                <a-space>
                    <label>退货数量：</label>
                    <span>{{count}}</span>
                </a-space>
            </div>
            <div class="mb10">
                <a-space>
                    <label>退款金额：</label>
                    <span style="color: red">{{price.toDecimalString()}}</span>
                </a-space>
            </div>
            <div class="mb10">
                <a-space>
                    <label>发货状态：</label>
                    <span style="color: red" v-if="deliveryStatus">已发货</span>
                    <span style="color: red" v-else>未发货</span>
                </a-space>
            </div>
            <div v-if="address!=null" class="mb10">
                <a-space>
                    <label>退货地址：</label>
                    <div>
                        <span class="mr5">{{address.province}}</span>
                        <span class="mr5">{{address.city}}</span>
                        <span class="mr5">{{address.district}}</span>
                        <span class="mr5">{{address.detail}}</span>
                        <span class="mr5">{{address.name}}</span>
                        <span>{{address.phone}}</span>
                    </div>
                </a-space>
            </div>
            <div class="mb10">
                <a-row type="flex">
                    <label class="mr15">拒绝原因</label>
                    <a-textarea v-model="message" style="width: 200px;height: 80px"/>
                </a-row>
            </div>
            <div>
                <a-checkbox class="font-size-12">操作完成后自动跳转至下一笔待处理售后申请</a-checkbox>
            </div>
        </div>
    </a-modal>
</template>

<script>
import util from '../../common/common'

export default {
    name: "RebateOrderDetailPageHandleDialog",
    props: {
        confirmBtnText: String,
        isShow: Boolean,
        loading: Boolean,
        isShowRefuseReason: Boolean,
        mode: String,
        count: String,
        price: Number,
        deliveryStatus: Boolean,
        address: Object
    },
    data() {
        return {
            message: ''
        }
    },
    methods: {
        onConfirm() {
            if (this.isShowRefuseReason && util.TextExtend.String.isEmptyOrNull(this.message)) {
                this.$message.warning('请填写拒绝理由')
                return
            }
            this.$emit('confirm', this.message)
        },
        onCancel() {
            this.$emit('cancel')
        }
    }
}
</script>

<style scoped>

</style>
