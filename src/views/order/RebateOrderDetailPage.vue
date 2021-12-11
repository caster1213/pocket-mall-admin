<template>
    <div v-if="isPageLoadFinish" class="p-container">
        <div class="p-box p-box-bg-gary">
            <p-rebate-state-box :order="model"/>
            <p-rebate-product-box :order="model"/>
            <p-rebate-express-box v-if="model.customExpress!==null" :order="model"/>
            <p-rebate-step-box :order="model"/>
        </div>
        <p-footer v-if="isShowBtnHandle">
            <template #content>
                <template v-if="model.state === constant.state.apply">
                    <a-button type="primary" @click="onApprove">
                        同意售后申请
                    </a-button>
                    <a-button class="ml15" @click="onOpenConfirmRefuseDialog('拒绝售后申请')">
                        拒绝售后申请
                    </a-button>
                </template>
                <template
                        v-if="model.state === constant.state.delivery && model.serviceMode !== constant.mode.exchange">
                    <a-button type="primary" @click="onOpenConfirmExchangeRebateDialog">
                        确认收货并退款
                    </a-button>
                    <a-button class="ml15" @click="onOpenConfirmRefuseDialog('拒绝收货')">
                        拒绝收货
                    </a-button>
                </template>
                <template
                        v-if="model.state === constant.state.delivery && model.serviceMode === constant.mode.exchange">
                    <a-button type="primary" @click="onOpenConfirmExpressDialog">
                        确认收货并发货
                    </a-button>
                    <a-button class="ml15" @click="onOpenConfirmRefuseDialog('拒绝收货')">
                        拒绝收货
                    </a-button>
                </template>
            </template>
        </p-footer>
        <p-rebate-approve-dialog
                :is-show="exchangeApproveDialog.isShow"
                :loading="exchangeApproveDialog.loading"
                :service-number="serviceNumber"
                :mode="model.serviceMode"
                :rebate-price="util.toDecimal2(model.applyPrice)"
                @cancel="()=>{exchangeApproveDialog.isShow=false}"
                @confirm="onConfirmApprove"
        ></p-rebate-approve-dialog>
        <p-rebate-handle-dialog :is-show="rebateDialog.isShow"
                                :loading="rebateDialog.loading"
                                :price="rebateDialog.price"
                                :count="rebateDialog.count"
                                :mode="rebateDialog.mode"
                                :delivery-status="rebateDialog.deliveryStatus"
                                :address="rebateDialog.address"
                                :confirm-btn-text="rebateDialog.text"
                                @cancel="()=>{rebateDialog.isShow = false}"
                                @confirm="onConfirmExchangeRebate"
        ></p-rebate-handle-dialog>
        <p-rebate-handle-dialog :is-show="refuseDialog.isShow"
                                :loading="refuseDialog.loading"
                                :price="refuseDialog.price"
                                :count="refuseDialog.count"
                                :mode="refuseDialog.mode"
                                :is-show-refuse-reason="true"
                                :delivery-status="refuseDialog.deliveryStatus"
                                :address="refuseDialog.address"
                                :confirm-btn-text="refuseDialog.text"
                                @cancel="()=>{refuseDialog.isShow = false}"
                                @confirm="onConfirmRefuse"
        ></p-rebate-handle-dialog>
        <p-rebate-express-dialog :is-show="expressDialog.isShow" :order="expressDialog.model"
                                 :loading="expressDialog.loading"
                                 @confirm="onConfirmExchange"
                                 @cancel="()=>{expressDialog.isShow = false}"
        ></p-rebate-express-dialog>
    </div>
</template>

<script>
import RebateOrderDetailPageApproveDialog from "./RebateOrderDetailPageApproveDialog"
import RebateOrderDetailPageExpressDialog from "./RebateOrderDetailPageExpressDialog"
import RebateOrderDetailPageHandleDialog from "./RebateOrderDetailPageHandleDialog"
import RebateOrderDetailPageStateBox from "./RebateOrderDetailPageStateBox"
import RebateOrderDetailPageProductBox from "./RebateOrderDetailPageProductBox"
import RebateOrderDetailPageExpressBox from "./RebateOrderDetailPageExpressBox"
import RebateOrderDetailPageStepBox from "./RebateOrderDetailPageStepBox"
import RebateServiceAPI from '../../service/order.rebate.service'
import constant from "../../common/constant"
import util from '../../common/common'

export default {
    name: "RebateOrderDetailPage",
    components: {
        'p-rebate-state-box': RebateOrderDetailPageStateBox,
        'p-rebate-express-box': RebateOrderDetailPageExpressBox,
        'p-rebate-product-box': RebateOrderDetailPageProductBox,
        'p-rebate-approve-dialog': RebateOrderDetailPageApproveDialog,
        'p-rebate-express-dialog': RebateOrderDetailPageExpressDialog,
        'p-rebate-handle-dialog': RebateOrderDetailPageHandleDialog,
        'p-rebate-step-box': RebateOrderDetailPageStepBox
    },
    data() {
        return {
            constant: constant.rebateConstant,
            util: util,
            serviceNumber: '',
            model: null,
            isPageLoadFinish: false,
            exchangeApproveDialog: {
                isShow: false,
                loading: false
            },
            rebateDialog: {
                isShow: false,
                loading: false,
                text: '确认收到退货',
                price: 0,
                count: '',
                mode: '',
                deliveryStatus: '',
                address: null
            },
            refuseDialog: {
                isShow: false,
                loading: false,
                text: '拒绝申请',
                price: 0,
                count: '',
                mode: '',
                deliveryStatus: '',
                address: null
            },
            expressDialog: {
                isShow: false,
                loading: false,
                model: {
                    title: '',
                    image: '',
                    count: '',
                    sku: [],
                    deliveryMode: -1,
                    name: '',
                    phone: '',
                    detail: '',
                    districtCode: ''
                }
            },
            rebateAddress: null
        }
    },
    created() {
        this.serviceNumber = this.$route.query.serviceNumber
        this.getDataSource()
    },
    computed: {
        isShowBtnHandle() {
            if (this.model.state === this.constant.state.apply) {
                return true
            }
            if (this.model.state === this.constant.state.delivery) {
                return true
            }
            return false
        }
    },
    methods: {
        getDataSource() {
            RebateServiceAPI.get({serviceNumber: this.serviceNumber}).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.state = res.data.result.state
                    this.model = res.data.result
                    this.isPageLoadFinish = true
                }
            })
        },
        onApprove() {
            if (this.model.serviceMode === this.constant.mode.exchange || this.model.serviceMode === this.constant.mode.exchangeRebate) {
                this.exchangeApproveDialog.isShow = true
            }
        },
        onRefuse() {
            this.loading = true
            RebateServiceAPI.refuse({serviceNumber: this.serviceNumber}).then(res => {
                this.loading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('操作成功')
                    this.getDataSource()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        onConfirmApprove(addressId) {
            this.exchangeApproveDialog.loading = true
            RebateServiceAPI.approve({
                serviceNumber: this.serviceNumber,
                addressId: addressId
            }).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('操作成功')
                    this.getDataSource()
                    this.exchangeApproveDialog.isShow = false
                    this.exchangeApproveDialog.loading = false
                } else {
                    this.exchangeApproveDialog.loading = false
                    this.$message.error(res.data.msg)
                }
            })
        },
        onOpenConfirmExpressDialog() {
            this.expressDialog.isShow = true
            this.expressDialog.model.deliveryMode = this.model.deliveryMode
            this.expressDialog.model.title = this.model.productTitle
            this.expressDialog.model.count = this.model.productCount
            this.expressDialog.model.sku = this.model.productSku
            this.expressDialog.model.image = this.model.productImage
            if (this.model.deliveryMode === constant.freightModel.merchantFreight) {
                this.expressDialog.model.name = this.model.deliveryAddress.consigneeName
                this.expressDialog.model.phone = this.model.deliveryAddress.consigneePhone
                this.expressDialog.model.detail = this.model.deliveryAddress.detail
                this.expressDialog.model.districtCode = this.model.deliveryAddress.districtCode
            }
        },
        onOpenConfirmExchangeRebateDialog() {
            this.rebateDialog.isShow = true
            this.rebateDialog.price = this.model.applyPrice
            this.rebateDialog.mode = this.constant.mode.options.find(x => x.value === this.model.serviceMode).label
            this.rebateDialog.deliveryStatus = this.model.isDelivery
            this.rebateDialog.count = this.model.productCount.toString()
            this.rebateDialog.address = {
                name: this.model.rebateAddress.consigneeName,
                phone: this.model.rebateAddress.consigneePhone,
                detail: this.model.rebateAddress.detail,
                province: this.model.rebateAddress.districtCode.getProvinceName(),
                city: this.model.rebateAddress.districtCode.getCityName(),
                district: this.model.rebateAddress.districtCode.getDistrictName(),
            }
        },
        onOpenConfirmRefuseDialog(text) {
            this.refuseDialog.isShow = true
            this.refuseDialog.text = text
            this.refuseDialog.price = this.model.applyPrice
            this.refuseDialog.mode = this.constant.mode.options.find(x => x.value === this.model.serviceMode).label
            this.refuseDialog.deliveryStatus = this.model.isDelivery
            this.refuseDialog.count = this.model.productCount.toString()
            if (this.model.rebateAddress !== null) {
                this.rebateDialog.address = {
                    name: this.model.rebateAddress.consigneeName,
                    phone: this.model.rebateAddress.consigneePhone,
                    detail: this.model.rebateAddress.detail,
                    province: this.model.rebateAddress.districtCode.getProvinceName(),
                    city: this.model.rebateAddress.districtCode.getCityName(),
                    district: this.model.rebateAddress.districtCode.getDistrictName(),
                }
            }
        },
        onConfirmExchangeRebate() {
            this.rebateDialog.loading = true
            RebateServiceAPI.confirmExchangeRebate({
                serviceNumber: this.serviceNumber
            }).then(res => {
                this.rebateDialog.loading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('操作成功')
                    this.getDataSource()
                    this.rebateDialog.isShow = false
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        onConfirmRefuse(msg) {
            this.refuseDialog.loading = true
            RebateServiceAPI.refuse({
                serviceNumber: this.serviceNumber,
                message: msg
            }).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('操作成功')
                    this.getDataSource()
                    this.refuseDialog.isShow = false
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        onConfirmExchange(selectExpressMode, expressName, expressCode) {
            this.expressDialog.loading = true
            RebateServiceAPI.confirm({
                serviceNumber: this.serviceNumber,
                selectExpressMode: selectExpressMode,
                expressName: expressName,
                expressCode: expressCode
            }).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.expressDialog.loading = false
                    this.$message.success('操作成功')
                    this.getDataSource()
                    this.expressDialog.isShow = false
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>

<style scoped>
    @import "../../assets/css/color.css";
</style>
