<template>
    <div class="p-box p-box-bg-white">
        <h3>退货物流</h3>
        <a-row type="flex">
            <a-col>
                <div>
                    <ul class="info-list">
                        <li>
                            <span>快递公司：</span>
                            <span>{{order.customExpress.expressName}}</span>
                        </li>
                        <li>
                            <span>快递单号：</span>
                            <span>{{order.customExpress.expressCode}}</span>
                        </li>
                        <li>
                            <span>填写时间：</span>
                            <span>{{expressDate}}</span>
                        </li>
                        <li>
                            <span>物流说明：</span>
                            <span>{{order.customExpress.remark}}</span>
                        </li>
                        <li>
                            <a-row type="flex">
                                <a-col>上传凭证：</a-col>
                                <a-col>
                                    <template  v-if="images.length >0">
                                        <img v-for="(img, index) in images" :key="index" :src="img" class="mr5" width="50"
                                             height="50"/>
                                    </template>
                                    <span v-else>未上传凭证</span>
                                </a-col>
                            </a-row>
                        </li>
                    </ul>
                </div>
            </a-col>
            <a-col offset="2">
                <div>
                    <span style="color: #9797A1">物流状态：</span>
                    <span style="color: #ed6a0c">未查询到物流信息</span>
                </div>
                <div style="overflow: scroll;max-height: 145px;display: none" class="mt20 pt5">
                    <a-timeline>
                        <a-timeline-item style="padding-top: -3px" class="font-size-12">
                            <span>2020-11-10 20:30:00</span>
                            <span class="font-bold ml10">您提交了订单，请等待系统确认</span>
                        </a-timeline-item>
                        <a-timeline-item color="gray" class="font-size-12">
                            <div class="gray-7">
                                <span>2020-11-10 20:30:00</span>
                                <span class="ml10">您的订单已经进入沈阳仓库准备出库</span>
                            </div>
                        </a-timeline-item>
                        <a-timeline-item color="gray" class="font-size-12">
                            <div class="gray-7">
                                <span>2020-11-10 20:30:00</span>
                                <span class="ml10">您的订单打印完成</span>
                            </div>
                        </a-timeline-item>
                        <a-timeline-item color="gray" class="font-size-12">
                            <div class="gray-7">
                                <span>2020-11-10 20:30:00</span>
                                <span class="ml10">您的订单分拣完成</span>
                            </div>
                        </a-timeline-item>
                        <a-timeline-item color="gray" class="font-size-12">
                            <span>2020-11-10 20:30:00</span>
                            <span>您的订单正在发往大连分拣中心</span>
                        </a-timeline-item>
                    </a-timeline>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: "RebateOrderDetailPageExpressBox",
    props: {
        order: Object
    },
    data() {
        return {
            images: [], //this.order.images.split(','),
            expressDate: moment(this.order.customExpress.expressSubmitDate).format('YYYY-MM-DD HH:mm:ss')
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
