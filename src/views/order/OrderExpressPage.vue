<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <a-row type="flex">
                        <a-space>
                            <a-input-group style="display: flex;width: auto;" compact>
                                <a-select v-model="filter.timeOption" class="font-size-12">
                                    <a-select-option value="createDate">下单时间</a-select-option>
                                    <a-select-option value="payDate">支付时间</a-select-option>
                                    <a-select-option value="deliveryDate">发货时间</a-select-option>
                                </a-select>
                                <a-range-picker v-model="filter.timeValue" @ok="getDataSource"
                                                show-time></a-range-picker>
                            </a-input-group>
                            <a-button class="font-size-12  p-input-left">批量发货</a-button>
                        </a-space>
                    </a-row>
                    <a-row type="flex">
                        <a-input-group style="display: inline-block;" compact>
                            <a-select v-model="filter.searchOption" default-value="1" style="width: 100px"
                                      class="font-size-12">
                                <a-select-option value="orderNumber">订单编号</a-select-option>
                                <a-select-option value="productTitle">商品名称</a-select-option>
                                <a-select-option value="userNae">客户名称</a-select-option>
                                <a-select-option value="userPhone">客户电话</a-select-option>
                                <a-select-option value="deliveryName">收货人姓名</a-select-option>
                                <a-select-option value="deliveryPhone">收货人电话</a-select-option>
                                <a-select-option value="transactionCode">支付单号</a-select-option>
                            </a-select>
                            <a-input-search v-model="filter.searchValue" @search="getDataSource" style="width: 150px">
                                <a-button icon="search" slot="enterButton"></a-button>
                            </a-input-search>
                        </a-input-group>
                    </a-row>
                </a-row>
            </div>
            <div class="p-box p-box-bg-white">
                <p-order-table :loading="loading" :data-source="dataSource" :columns="columns"
                               @delivered="onDelivered"/>
            </div>
        </div>
        <p-footer-page
                :page-total="pageOption.pageTotal"
                :page-index="pageOption.pageIndex"
                @nextPage="(pageIndex)=>{
                    pageOption.pageIndex = pageIndex
                    getDataSource()
                }"
                @nextPageSize="(pageIndex,pageSize)=>{
                    pageOption.pageIndex = 1
                    pageOption.pageSize = pageSize
                    getDataSource()
                }"
        ></p-footer-page>
    </div>
</template>

<script>
import orderApi from '../../service/order.service'
import constant from "../../common/constant"

export default {
    name: "OrderExpressPage",
    data() {
        return {
            filter: {
                timeOption: 'createDate',
                timeValue: [],
                searchOption: 'orderNumber',
                searchValue: ''
            },
            columns: [{
                title: '商品信息',
                field: 'products'
            }, {
                title: '实收款',
                field: 'price'
            }, {
                title: '客户信息',
                field: 'custom'
            }, {
                title: '配送及支付方式',
                field: 'deliveryOrPayment'
            }, {
                title: '订单状态',
                field: 'orderState'
            }],
            loading: false,
            dataSource: [],
            pageOption: {
                pageSize: 25,
                pageIndex: 1,
                pageTotal: 0
            }
        }
    },
    created() {
        this.getDataSource()
    },
    methods: {
        getDataSource() {
            let filterOption = {}
            if (this.filter.timeValue.length > 0) {
                filterOption[this.filter.timeOption + 'Start'] = this.filter.timeValue[0].format('YYYY-MM-DD HH:mm:ss')
                filterOption[this.filter.timeOption + 'End'] = this.filter.timeValue[1].format('YYYY-MM-DD HH:mm:ss')
            }
            if (this.filter.searchValue.length > 0) {
                filterOption[this.filter.searchOption] = this.filter.searchValue
            }
            filterOption.orderState = constant.orderState.payment
            filterOption.deliveryMode = constant.freightModel.merchantFreight
            filterOption.pageIndex = this.pageOption.pageIndex
            filterOption.pageSize = this.pageOption.pageSize
            this.loading = true
            orderApi.list(filterOption).then(res => {
                this.loading = false
                this.dataSource = res.data.result.list.map(x => {
                    let row = {
                        id: x.id,
                        orderNumber: x.orderNumber,
                        orderState: x.orderState,
                        createDate: x.createDate,
                        orderGenre: x.orderGenre,
                        payPrice: x.payPrice,
                        payGenre: x.payGenre,
                        userName: x.userName,
                        deliveryMode: x.orderDeliveryMode,
                        source: x.source,
                        marker: x.marker,
                        markerContent: x.markerContent,
                        orderItem: x.orderItem.map(i => {
                            return {
                                productImage: i.productImage,
                                productName: i.productName,
                                productPrice: i.productPrice,
                                quantity: i.quantity,
                                sku: []
                            }
                        })
                    }
                    console.log(row)
                    return row
                })
            }).catch(err => {
                this.loading = false
            })

        },
        onDelivered(order) {
            this.$order.delivery({
                orderId: order.orderNumber,
                onSucceed: () => {
                    this.$message.success(' 发货成功')
                    this.getDataSource()
                },
                onFailed: (err) => {
                    this.$message.error(err)
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
