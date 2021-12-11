<template>
    <a-modal title="售后申请处理" :confirm-loading="loading" @cancel="onCancel" @ok="onConfirm" class="dialog-box"
             ok-text="同意并发送退货地址"
             :visible="visible">
        <div class="mb10">
            <a-space>
                <label>售后方式：</label>
                <span>退货退款</span>
            </a-space>
        </div>
        <div class="mb10">
            <a-space>
                <label>售后数量：</label>
                <span>3</span>
            </a-space>
        </div>
        <div class="mb10">
            <a-space>
                <label>售后金额：</label>
                <span>{{rebatePrice}}</span>
            </a-space>
        </div>
        <div v-if="mode !== constant.mode.rebate" class="p-box p-box-bg-gary">
            <a-radio-group v-model="selectAddressId">
                <a-radio v-for="(item,index) in address" :key="index" class="radio-option"
                         :value="item.id">
                    <span class="mr10"> {{item.detail}}</span>
                    <a-tag v-for="(label,index) in item.labels" :key="index+'l'" color="#2db7f5">
                        {{label}}
                    </a-tag>
                </a-radio>
            </a-radio-group>
        </div>
        <!--<div>
            <a-checkbox>操作完成后自动跳转至下一笔待处理售后申请</a-checkbox>
        </div>-->
    </a-modal>
</template>

<script>
import AddressStoreServiceAPI from "../../service/address.store.api"
import region from "../../common/area"
import constant from "../../common/constant";

export default {
    name: "RebateOrderApproveDialog",
    props: {
        isShow: Boolean,
        mode: Number,
        serviceNumber: String,
        rebatePrice: String,
        loading: Boolean
    },
    data() {
        return {
            visible: this.isShow,
            constant: constant.rebateConstant,
            address: [],
            selectAddressId: null
        }
    },
    watch: {
        isShow(nValue) {
            this.visible = nValue
        }
    },
    created() {
        this.getAddress()
    },
    methods: {
        getAddress() {
            AddressStoreServiceAPI.list({
                pageIndex: 1,
                pageSize: 10
            }).then(res => {
                this.address = res.data.result.list.map(x => {
                    let province = region.province_list[parseInt(x.districtCode.toString().substring(0, 2) + '0000')]
                    let city = region.city_list[parseInt(x.districtCode.toString().substring(0, 4) + '00')]
                    let district = region.county_list[x.districtCode]
                    return {
                        id: x.id,
                        detail: province + city + district + x.detail,
                        labels: x.labels.split(',')
                    }
                })
            })
        },
        onConfirm() {
            if (this.selectAddressId === null) {
                this.$message.warning('请选择一个地址')
                return
            }
            this.$emit('confirm',this.selectAddressId)
        },
        onCancel() {
            this.$emit('cancel')
        }
    }
}
</script>

<style scoped>
    .dialog-box {
    }

    .dialog-box .radio-option {
        display: block;
        margin-bottom: 5px;
    }
</style>
