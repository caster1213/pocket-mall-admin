<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <a-row type="flex">
                        <a-space>
                            <a-select class="font-size-12" placeholder="处理进度" style="width: 120px">
                                <a-select-option value="-1">全部</a-select-option>
                                <a-select-option value="1">待处理</a-select-option>
                                <a-select-option value="2">处理中</a-select-option>
                                <a-select-option value="3">已完成</a-select-option>
                                <a-select-option value="4">已取消</a-select-option>
                            </a-select>
                            <a-select class="font-size-12" placeholder="售后类型" style="width: 120px">
                                <a-select-option value="-1">全部</a-select-option>
                                <a-select-option value="1">仅退款</a-select-option>
                                <a-select-option value="2">仅退货</a-select-option>
                                <a-select-option value="3">退款退货</a-select-option>
                            </a-select>
                            <a-select class="font-size-12" placeholder="售后状态" style="width: 120px">
                                <a-select-option value="0">全部</a-select-option>
                                <a-select-option value="1">申请售后</a-select-option>
                                <a-select-option value="2">等待买家退货</a-select-option>
                                <a-select-option value="3">已退货,待收货</a-select-option>
                                <a-select-option value="4">已收货,换货中</a-select-option>
                                <a-select-option value="5">系统退款中</a-select-option>
                                <a-select-option value="0">已完成</a-select-option>
                                <a-select-option value="-1">已拒绝</a-select-option>
                                <a-select-option value="-2">已取消</a-select-option>
                            </a-select>
                            <a-range-picker></a-range-picker>
                        </a-space>
                    </a-row>
                    <a-row type="flex">
                        <a-input-group style="display: inline-block;" compact>
                            <a-select default-value="orderNumber" style="width: 100px"
                                      class="font-size-12">
                                <a-select-option value="orderNumber">订单编号</a-select-option>
                                <a-select-option value="productTitle">服务单号</a-select-option>
                            </a-select>
                            <a-input-search style="width: 150px">
                                <a-button icon="search" slot="enterButton"></a-button>
                            </a-input-search>
                        </a-input-group>
                    </a-row>
                </a-row>
            </div>
            <div class="p-box p-box-bg-white">
                <a-spin :spinning="loading">
                    <table class="order-table">
                        <thead>
                        <tr>
                            <th style="width: 40px;">
                                <a-checkbox></a-checkbox>
                            </th>
                            <th style="text-align: left;padding: 0">商品信息</th>
                            <th>实收金额</th>
                            <th>售后类型</th>
                            <th>买家信息</th>
                            <th>退款金额</th>
                            <th>订单状态</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-if="dataSource.length >0" v-for="row in dataSource">
                            <tr :key="row.serviceNumber">
                                <td style="width: 40px;text-align: center">
                                    <a-checkbox v-model="row.checked"></a-checkbox>
                                </td>
                                <td colspan="7" style="border-bottom: 2px solid #F2F2F6">
                                    <a-row type="flex" justify="space-between">
                                        <a-space>
                                            <span style="margin-right: 40px;margin-left: 0;" class="font-size-12">售后单号：{{row.serviceNumber}}</span>
                                            <span style="margin-right: 40px"
                                                  class="font-size-12">申请时间：{{moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
                                            <span>
                                                <span>订单编号：</span>
                                                 <router-link
                                                         class="font-size-12"
                                                         :to="{path:'/order/detail',query:{orderNumber:row.orderNumber}}"
                                                         tag="a">{{row.orderNumber}}
                                            </router-link>
                                            </span>
                                        </a-space>
                                       <!-- <div style="padding: 8px 15px">
                                            <a-space>
                                                &lt;!&ndash; <router-link
                                                         class="detail"
                                                         :to="{path:'/rebate/detail',query:{serviceNumber:row.serviceNumber}}"
                                                         tag="span">售后详情
                                                 </router-link>&ndash;&gt;
                                                <router-link
                                                        class="detail"
                                                        :to="{path:'/order/detail',query:{orderNumber:row.orderNumber}}"
                                                        tag="a">订单详情
                                                </router-link>
                                            </a-space>
                                        </div>-->
                                    </a-row>

                                </td>
                            </tr>
                            <tr :key="row.serviceNumber+'i'">
                                <td>
                                </td>
                                <td style="max-width: 250px;padding-bottom: 10px;padding-left: 0">
                                    <a-row style="flex-wrap: nowrap"
                                           type="flex">
                                        <a-col>
                                            <img width="60px" height="60px"
                                                 :src="row.productImage">
                                        </a-col>
                                        <a-col style="margin-left: 10px;width: calc(100% - 100px)">
                                            <a-row type="flex" style="flex-direction: column">
                                                <span style="width: 100%" class="font-size-12 text-row-1 font-bold">{{row.productTitle}}</span>
                                                <div style="padding-top: 5px">
                                                    <span class="font-size-12">数量：{{row.productCount}}</span>
                                                    <!--<span v-if="item.sku.length>0"
                                                          class="font-size-12">【标配/蓝色/128g】</span>-->
                                                </div>
                                                <span style="padding-top: 5px" class="font-size-12">单价：¥{{util.toDecimal2(row.productSalePrice * row.productCount)}}</span>
                                            </a-row>
                                        </a-col>
                                    </a-row>
                                </td>
                                <td>
                                    ¥{{util.toDecimal2(row.productSalePrice * row.productCount)}}
                                </td>
                                <td>
                                    <span>{{row.serviceModeText}}</span>
                                </td>
                                <td>
                                    {{row.nickname}}
                                </td>
                                <td>
                                    <span>{{util.toDecimal2(row.rebatePrice)}}</span>
                                </td>
                                <td>
                                    <span v-if="row.serviceState === flag.state.apply">买家已提交售后申请，待审核</span>
                                    <span v-if="row.serviceState === flag.state.approve && row.serviceMode === flag.mode.exchange">买家售后审核已通过，等待买家发货</span>
                                    <span v-if="row.serviceState === flag.state.approve && row.serviceMode === flag.mode.exchangeRebate">买家售后审核已通过，等待买家发货</span>
                                    <span v-if="row.serviceState === flag.state.approve && row.serviceMode === flag.mode.rebate">买家售后审核已通过，等待退款</span>
                                    <span v-if="row.serviceState === flag.state.delivery">买家已提交物流信息，等待商家确认</span>
                                    <span v-if="row.serviceState === flag.state.confirm">商家已发货，等待买家确认收货</span>
                                    <span v-if="row.serviceState === flag.state.refuse">售后申请，已拒绝</span>
                                    <span v-if="row.serviceState === flag.state.complete">售后申请，已处理</span>
                                    <span v-if="row.serviceState === flag.state.cancel">售后申请，已撤销</span>
                                </td>
                                <td style="text-align: right">
                                    <a-button @click="onToDetail(row.serviceNumber)" type="primary" ghost
                                              class="font-size-12">{{getBtnText(row.serviceState)}}
                                    </a-button>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="dataSource.length ===0">
                            <td align="center" colspan="8">暂无订单数据</td>
                        </tr>
                        </tbody>
                    </table>
                </a-spin>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import rebateApi from '../../service/order.rebate.service'
import util from '../../common/common'
import constant from "../../common/constant"

export default {
    name: "OrderAftermarketPage",
    data() {
        return {
            util: util,
            moment: moment,
            flag: constant.rebateConstant,
            columns: [{
                title: '商品信息',
                field: 'products'
            }, {
                title: '实收金额',
                field: 'price'
            }, {
                title: '售后类型',
                field: 'custom'
            }, {
                title: '买家信息',
                field: 'custom'
            }, {
                title: '退款金额',
                field: 'deliveryOrPayment'
            }, {
                title: '订单状态',
                field: 'orderState'
            }],
            dataSource: [],
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 0
            },
            loading: false
        }
    },
    created() {
        this.getDataSource()
    },
    methods: {
        getDataSource() {
            this.loading = true
            rebateApi.list({
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize
            }).then(res => {
                this.loading = false
                this.dataSource = res.data.result.list
                this.pageOption.pageTotal = res.data.result.total
                this.dataSource.forEach(x => {
                    x.serviceModeText = this.flag.mode.options.find(c => c.value === x.serviceMode).label
                })
            })
        },
        getBtnText(state) {
            if (state === constant.rebateConstant.state.cancel) {
                return '查看详情'
            }
            if (state === constant.rebateConstant.state.refuse) {
                return '查看详情'
            }
            if (state === constant.rebateConstant.state.complete) {
                return '查看详情'
            }
            return '处理售后'
        },
        onToDetail(serviceNumber) {
            this.$router.push({path: '/rebate/detail', query: {serviceNumber: serviceNumber}})
        }
    }
}
</script>

<style scoped>
    .order-table {
        width: 100%;
    }

    .order-table thead tr {
        border-bottom: 10px solid #F2F2F6;
        background-color: #fff
    }

    .order-table thead tr th {
        padding: 8px 15px;
    }

    .order-table tbody tr:nth-child(odd) {
        background-color: #fff;
        height: 50px
    }

    .order-table tbody tr:nth-child(even) {
        border-bottom: 10px solid #F2F2F6;
        background-color: #fff
    }

    .order-table tbody tr:nth-child(even) td:nth-of-type(1n+2) {
        padding: 8px 15px;
        border-top: 1px solid #F2F2F6;
        vertical-align: top;
    }

    .order-table .detail {
        cursor: pointer;
    }

    .order-table .detail:hover {
        font-weight: bold;
    }
</style>
