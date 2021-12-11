<template>
    <div class="p-box p-box-bg-white">
        <a-row type="flex">
            <a-col style="flex: 1">
                <h3>售后商品</h3>
                <a-row type="flex">
                    <img :src="order.productImage"
                         width="75" height="75"/>
                    <div style="width: calc(100% - 175px)" class="text-row-1">
                        <span class="ml10 font-bold" style="color: #9797A1">{{order.productTitle}}</span>
                    </div>
                </a-row>
            </a-col>
            <a-col style="flex: 1">
                <h3>售后信息</h3>
                <div>
                    <ul class="info-list">
                        <li>
                            <span>退款方式：</span>
                            <span>{{getModeString}}</span>
                        </li>
                        <li>
                            <span>退款金额：</span>
                            <span>{{order.rebatePrice.toDecimalString()}}</span>
                        </li>
                        <li>
                            <span>退货数量：</span>
                            <span>{{order.productCount}}</span>
                        </li>
                        <li>
                            <span>联系方式：</span>
                            <span>{{order.phone}}</span>
                        </li>
                        <li>
                            <span>售后原因：</span>
                            <span>{{order.reasonOption}}</span>
                        </li>
                        <li>
                            <span>售后说明：</span>
                            <span>{{order.reasonContent}}</span>
                        </li>
                        <li>
                            <span>售后历史：</span>
                            <span>{{order.histories.length}}次</span>
                        </li>
                    </ul>
                </div>
            </a-col>
            <a-col style="flex: 1">
                <h3>购买信息</h3>
                <div>
                    <ul class="info-list">
                        <li>
                            <span>商品单价：</span>
                            <span> ¥ {{order.productPrice.toDecimalString()}}</span>
                        </li>
                        <li>
                            <span>实付金额：</span>
                            <span> ¥ {{order.paymentPrice.toDecimalString()}} (已退¥ {{order.rebatePrice.toDecimalString()}})</span>
                        </li>
                        <li>
                            <span>发货状态：</span>
                            <span v-if="order.isDelivery">已发货</span>
                            <span v-else>未发货</span>
                        </li>
                        <li>
                            <span>订单编号：</span>
                            <a>{{order.orderNumber}}</a>
                        </li>
                    </ul>
                </div>
            </a-col>
            <a-col v-if="order.rebateAddress!== null" style="flex: 1">
                <h3>退货地址</h3>
                <div>
                    <ul class="info-list">
                        <li>
                            <span>联系电话：</span>
                            <span>{{order.rebateAddress.consigneePhone}}</span>
                        </li>
                        <li>
                            <span>联系人：</span>
                            <span>{{order.rebateAddress.consigneeName}}</span>
                        </li>
                        <li>
                            <span>退货地址：</span>
                            <span>{{order.rebateAddress.districtCode.getProvinceName()}}</span>
                            <span>{{order.rebateAddress.districtCode.getCityName()}}</span>
                            <span>{{order.rebateAddress.districtCode.getDistrictName()}}</span>
                            <span>{{order.rebateAddress.detail}}</span>
                        </li>
                    </ul>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import constant from "../../common/constant";

export default {
    name: "RebateOrderDetailPageProductBox",
    props: {
        // product: Object,
        order: Object,
        // address: Object
    },
    data() {
        return {
            constant: constant.rebateConstant
        }
    },
    computed: {
        getModeString() {
            let option = constant.rebateConstant.mode.options.find(x => x.value === this.order.serviceMode)
            if (option === undefined) return ''
            return option.label
        }
    }
}
</script>

<style scoped>

    .info-list {
        list-style: none;
    }

    .info-list li {
        margin-top: 5px;
    }
</style>
