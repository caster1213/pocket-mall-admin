<template>
    <a-spin :spinning="loading">
        <table class="order-table">
            <thead>
            <tr>
                <th style="width: 40px;">
                    <a-checkbox @change="onCheckAll" v-model="checkAll"></a-checkbox>
                </th>
                <th v-for="col in columns" :key="col.field">{{col.title}}</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <template v-if="dataSource.length >0" v-for="row in dataSource">
                <tr :key="row.id">
                    <td style="width: 40px;text-align: center">
                        <a-checkbox v-model="row.checked"></a-checkbox>
                    </td>
                    <td colspan="6" style="border-bottom: 2px solid #F2F2F6">
                        <a-row type="flex" justify="space-between">
                            <a-space>
                                <span style="margin-right: 40px;margin-left: 0;" class="font-size-12">订单编号：{{row.orderNumber}}</span>
                                <span style="margin-right: 40px"
                                      class="font-size-12">下单时间：{{moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
                                <span class="font-size-12">订单来源：公众号</span>
                            </a-space>
                            <div class="detail">
                                <a-space>
                                    <router-link
                                            :to="{path:'/order/detail',query:{orderNumber:row.orderNumber}}"
                                            tag="span">订单详情
                                    </router-link>
                                    <a-icon v-if="row.marker === 1" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}"
                                            :component="FlagIcon"></a-icon>
                                    <a-icon v-if="row.marker === 2" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}"
                                            :component="FlagYellow"></a-icon>
                                    <a-icon v-if="row.marker === 4" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}"
                                            :component="FlagBlue"></a-icon>
                                    <a-icon v-if="row.marker === 3" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}"
                                            :component="FlagGreen"></a-icon>
                                    <a-icon v-if="row.marker === 5" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}"
                                            :component="FlagViolet"></a-icon>
                                    <a-icon v-if="row.marker === 0" @click="onMarker(row)"
                                            :style="{fontSize:'18px'}" :component="FlagGrey"></a-icon>
                                </a-space>
                            </div>
                        </a-row>

                    </td>
                </tr>
                <tr :key="row.id+'i'">
                    <td>
                    </td>
                    <td style="max-width: 250px;padding-bottom: 10px;padding-left: 0">
                        <a-row v-for="(item,index) in row.orderItem" :key="index" style="flex-wrap: nowrap"
                               type="flex">
                            <a-col>
                                <img width="60px" height="60px"
                                     :src="item.productImage">
                            </a-col>
                            <a-col style="margin-left: 10px;width: calc(100% - 100px)">
                                <a-row type="flex" style="flex-direction: column">
                                    <span style="width: 100%" class="font-size-12 text-row-1 font-bold">{{item.productName}}</span>
                                    <div style="padding-top: 5px">
                                        <span class="font-size-12">数量：{{item.quantity}}</span>
                                        <span v-if="item.sku.length>0"
                                              class="font-size-12">【标配/蓝色/128g】</span>
                                    </div>
                                    <span style="padding-top: 5px" class="font-size-12">单价：¥{{item.productPrice}}</span>
                                </a-row>
                            </a-col>
                        </a-row>
                    </td>
                    <td>
                        ¥{{row.payPrice}}
                    </td>
                    <td>
                        {{row.userName}}
                    </td>
                    <td>
                        <div v-if="row.deliveryMode === 1" class="font-size-12">商家配送</div>
                        <div v-else-if="row.deliveryMode === 2" class="font-size-12">上门自提</div>
                        <div v-if="row.payGenre === 1" class="font-size-12">微信支付</div>
                        <div v-if="row.payGenre === 2" class="font-size-12">余额支付</div>
                    </td>
                    <td>
                        <p-order-status-box @delivered="onDelivered(row)"
                                            @cancel="onCancel(row)"
                                            :order-genre="row.orderGenre"
                                            :order-state="row.orderState"
                                            :is-send-freight="row.deliveryMode === 2"
                        />
                    </td>
                    <td style="text-align: right">
                    </td>
                </tr>
            </template>
            <tr v-if="dataSource.length ===0">
                <td align="center" colspan="6">
                    <a-empty style="margin-top: 15px" class="font-size-12"></a-empty>
                </td>
            </tr>
            </tbody>
        </table>
    </a-spin>
</template>

<script>
import FlagIcon from "./icon/FlagIcon"
import FlagYellow from "./icon/FlagYellow"
import FlagGreen from "./icon/FlagGreen"
import FlagBlue from "./icon/FlagBlue"
import FlagViolet from "./icon/FlagViolet"
import FlagGrey from "./icon/FlagGrey"
import moment from 'moment'

export default {
    name: "OrderTable",
    props: {
        loading: Boolean,
        dataSource: Array,
        columns:[]
    },
    data() {
        return {
            moment: moment,
            FlagIcon: FlagIcon,
            FlagYellow: FlagYellow,
            FlagGreen: FlagGreen,
            FlagBlue: FlagBlue,
            FlagViolet: FlagViolet,
            FlagGrey: FlagGrey,
            checkAll: false
        }
    },
    methods: {
        onCheckAll() {
            this.dataSource.forEach(x => x.checked = this.checkAll)
        },
        onMarker(order) {
            this.$emit('marker', order)
        },
        onDelivered(order) {
            this.$emit('delivered', order)
        },
        onCancel(order) {
            this.$emit('cancel', order)
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
        padding: 8px 15px;
        cursor: pointer;
    }

    .order-table .detail:hover span {
        font-weight: bold;
    }
</style>
