<template>
    <div class="p-box p-box-bg-white c-step">
        <a-row class="mb20" type="flex" justify="space-between" align="middle">
            <h3>协商记录</h3>
            <a>点击给买家留言</a>
        </a-row>
        <a-steps direction="vertical">
            <a-step v-for="(step,index) in steps" :key="index">
                <template slot="icon">
                    <div class="step-icon">
                        <span>{{step.icon}}</span>
                    </div>
                </template>
                <template slot="title">
                    <div style="width: 100%;" class="p-box p-box-bg-gary">
                        <a-row type="flex" justify="space-between" :class="{'state-row-title':step.list.length>0}">
                            <div>
                                <span class="gray-7 font-size-13">{{step.role}}</span>
                                <span class="ml15 font-bold font-size-13">{{step.title}}</span>
                            </div>
                            <div>
                                <span class="gray-7 font-size-12">{{step.date}}</span>
                            </div>
                        </a-row>
                        <div v-if="step.list.length>0">
                            <ul>
                                <template v-for="(option,optionIndex) in step.list">
                                    <li :key="optionIndex + 'i' + index"
                                        v-if="option.isImage"
                                        class="info-list">
                                        <a-row type="flex">
                                            <span class="font-size-12 gray-7">{{option.label}}：</span>
                                            <div>
                                                <img v-for="img in option.value" :key="img" :src="img" width="50"
                                                     height="70"/>
                                            </div>
                                        </a-row>
                                    </li>
                                    <li v-else :key="optionIndex + 'i' + index" class="info-list">
                                        <span class="font-size-12 gray-7">{{option.label}}：</span>
                                        <span class="font-size-12">{{option.value}}</span>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </template>
            </a-step>
        </a-steps>
    </div>
</template>

<script>
import moment from 'moment'
import constant from "../../common/constant"
import util from '../../common/common'

export default {
    name: "RebateOrderDetailPageStepBox",
    props: {
        order: Object
    },
    data() {
        return {
            steps: [],
            stateMap: Map
        }
    },
    created() {
        this.initStateMap()
        this.init()
    },
    methods: {
        init() {
            let flows = []
            for (const state in this.order.states) {
                flows.push({
                    state: state,
                    date: moment(this.order.states[state]).format('YYYY-MM-DD HH:mm:ss'),
                    timestamp: moment(this.order.states[state]).valueOf()
                })
            }
            flows.sort((a, b) => {
                if (a.timestamp > b.timestamp) {
                    return -1
                }
                if (a.timestamp < b.timestamp) {
                    return 1
                }
                return 0
            })
            this.steps = flows.map(x => {
                console.log(this.stateMap)
                let step = this.stateMap.get(parseInt(x.state))()
                step.date = x.date
                return step
            })
            console.log(this.steps)
        },
        initStateMap() {
            let stateMap = new Map()
            let modeOptions = constant.rebateConstant.mode.options
            let mode = this.order.serviceMode
            stateMap.set(constant.rebateConstant.state.apply, () => {
                return {
                    icon: '买',
                    role: '买家',
                    title: '发起了售后申请,等待商家处理',
                    date: '',
                    list: [
                        {label: '售后方式', value: modeOptions.find(x => x.value === mode).label},
                        {label: '退款原因', value: this.order.reasonOption},
                        {label: '退款金额', value: this.order.applyPrice.toDecimalString()},
                        {label: '退货数量', value: this.order.productCount},
                        {label: '退款说明', value: this.order.reasonContent.length === 0 ? '无' : this.order.reasonContent},
                        {label: '联系电话', value: this.order.phone},
                        {label: '上传凭证', value: this.order.uploadImages, isImage: true},
                    ]
                }
            })
            stateMap.set(constant.rebateConstant.state.approve, () => {
                let format = () => {
                    let sb = new util.TextExtend.StringBuilder()
                    sb.append(this.order.rebateAddress.districtCode.getProvinceName() + ' ')
                    sb.append(this.order.rebateAddress.districtCode.getCityName() + ' ')
                    sb.append(this.order.rebateAddress.districtCode.getDistrictName() + ' ')
                    sb.append(this.order.rebateAddress.consigneeName + ' ')
                    sb.append(this.order.rebateAddress.consigneePhone + ' ')
                    return sb.toString()
                }
                return {
                    icon: '商',
                    role: '商家',
                    title: '已同意售后申请,等待买家退货',
                    date: '',
                    list: [{
                        label: '退款地址', value: format()
                    },]
                }
            })
            stateMap.set(constant.rebateConstant.state.delivery, () => {
                return {
                    icon: '买',
                    role: '买家',
                    title: '已退货',
                    date: '',
                    list: [{
                        label: '快递公司', value: this.order.customExpress.expressName
                    }, {
                        label: '快递单号', value: this.order.customExpress.expressCode
                    }, {
                        label: '快递备注', value: this.order.customExpress.remark
                    }]
                }
            })

            this.stateMap = stateMap
            stateMap.set(constant.rebateConstant.state.confirm, () => {
                let sb = new util.TextExtend.StringBuilder()
                sb.append(`${this.order.exchangeAddress.districtCode.getProvinceName()} `)
                sb.append(`${this.order.exchangeAddress.districtCode.getCityName()} `)
                sb.append(`${this.order.exchangeAddress.districtCode.getDistrictName()} `)
                sb.append(`${this.order.exchangeAddress.detail} `)
                sb.append(`${this.order.exchangeAddress.consigneeName}-`)
                sb.append(`${this.order.exchangeAddress.consigneePhone} `)
                return {
                    icon: '商',
                    role: '商家',
                    title: '商家确认收货并重新发货',
                    list: [{
                        label: '换货地址', value: sb.toString()
                    }]
                }
            })
            stateMap.set(constant.rebateConstant.state.refuse, () => {
                return {
                    icon: '商',
                    role: '商家',
                    title: '拒绝了本次退款申请',
                    list: [{
                        label: '拒绝原因', value: this.order.refuseMessage
                    }]
                }
            })
            stateMap.set(constant.rebateConstant.state.cancel, () => {
                return {
                    icon: '买',
                    role: '买家',
                    title: '主动撤销换货，售后关闭',
                    list: []
                }
            })
            stateMap.set(constant.rebateConstant.state.complete, () => {
                let value = {
                    icon: '买',
                    role: '买家',
                    title: '已退货',
                    date: '',
                    list: [{
                        label: '快递公司', value: this.order.customExpress.expressName
                    }, {
                        label: '快递单号', value: this.order.customExpress.expressCode
                    }, {
                        label: '快递备注', value: this.order.customExpress.remark
                    }]
                }
                if (this.order.serviceMode === constant.rebateConstant.mode.exchange) {
                    value.icon = '买'
                } else {
                    value.icon = '商'
                }
                if (this.order.serviceMode === constant.rebateConstant.mode.exchange) {
                    value.role = '买家'
                } else {
                    value.role = '商家'
                }
                if (this.order.serviceMode === constant.rebateConstant.mode.exchange) {
                    value.title = '买家已确认收货'
                } else {
                    value.title = '同意退款给买家，本次维权结束'
                }
                if (this.order.serviceMode === constant.rebateConstant.mode.exchange) {
                    value.list = []
                } else {
                    value.list = [{
                        label: '退款金额',
                        value: `￥ ${this.order.rebatePrice.toDecimalString()}`
                    }]
                }
                return value
            })
        }
    }
}
</script>

<style scoped>
    .step-icon {
        border-radius: 50%;
        background: #2589FF;
        height: 25px;
        width: 25px;
        display: inline-block;
        line-height: 25px;
        color: white;
        font-size: 13px;
    }

    .c-step /deep/ .ant-steps-item-title {
        width: 100%;
        line-height: revert;
        color: black !important;
    }

    .state-row-title {
        border-bottom: 1px solid #ebedf0;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
</style>
