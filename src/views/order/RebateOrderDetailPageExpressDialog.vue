<template>
    <a-modal title="订单发货" :visible="isShow" ok-text="发货" @cancel="()=> $emit('cancel')" @ok="onConfirm">
        <div style="margin-top: -20px;" class="mb10">
            <a-alert type="warning" banner message="换货商品重新发货不会引起库存变化"/>
        </div>
        <div class="mb10">
            <a-row type="flex">
                <a-col>
                    <h4>商品信息</h4>
                </a-col>
                <a-col span="20" offset="1">
                    <a-row style="width: 100%" type="flex">
                        <a-col span="5">
                            <img :src="order.image"
                                 width="75" height="75"/>
                        </a-col>
                        <a-col span="15" class="ml15">
                            <div style="width: 100%" class="text-row-1">{{order.title}}</div>
                            <div>x{{order.count}}</div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div v-if="order.deliveryMode === freightModel.merchantFreight" class="mb10">
            <a-row type="flex">
                <a-col>
                    <h4>配送信息</h4>
                </a-col>
                <a-col offset="1">
                    <div class="mb5">
                        <span>配送方式：</span>
                        <span>快递</span>
                    </div>
                    <div class="mb5">
                        <span>收件人：</span>
                        <span>{{order.phone}}</span>
                        <span class="pl5">{{order.name}}</span>
                    </div>
                    <div class="mb5">
                        <span>收货地址：</span>
                        <span>{{order.districtCode.getProvinceName()}}</span>
                        <span>{{order.districtCode.getCityName()}}</span>
                        <span>{{order.districtCode.getDistrictName()}}</span>
                        <span>{{order.detail}}</span>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="mb10">
            <a-row type="flex">
                <a-col>
                    <h4>发货方式</h4>
                </a-col>
                <a-col offset="1">
                    <div class="mb10">
                        <a-radio-group v-model="selectExpressMode" default-value="2">
                            <a-radio value="1">在线下单</a-radio>
                            <a-radio value="2">线下发单</a-radio>
                            <a-radio value="3">无需物流</a-radio>
                        </a-radio-group>
                    </div>
                    <template v-if="selectExpressMode === '2'">
                        <div class="mb10">
                            <a-space>
                                <label>快递公司</label>
                                <a-select v-model="expressName" style="width: 160px">
                                    <a-select-option v-for="express in expressOptions" :value="express" :key="express">
                                        {{express}}
                                    </a-select-option>
                                </a-select>
                            </a-space>
                        </div>
                        <div class="mb10">
                            <a-space>
                                <label>快递单号</label>
                                <a-input v-model="expressCode" style="width: 160px"/>
                            </a-space>
                        </div>
                    </template>
                    <template v-if="selectExpressMode === '1'">
                        <a-alert type="warning" message="当前不支持在线下单" banner/>
                        <!--<a-form-model class="mt10" :label-col="{span:6}" :wrapper-col="{span:18}">
                            <a-form-model-item style="margin-bottom: 10px !important;" label="快递公司">
                                <a-select>
                                    <a-select-option v-for="express in expressOptions" :value="express" :key="express">
                                        {{express}}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item style="margin-bottom: 10px !important;" label="收件人">
                                <a-input/>
                            </a-form-model-item>
                            <a-form-model-item style="margin-bottom: 10px !important;" label="联系方式">
                                <a-input/>
                            </a-form-model-item>
                            <a-form-model-item style="margin-bottom: 10px !important;" label="地区">
                                <p-district-select/>
                            </a-form-model-item>
                            <a-form-model-item style="margin-bottom: 10px !important;" label="详细地址">
                                <a-input/>
                            </a-form-model-item>
                        </a-form-model>-->
                    </template>
                    <template v-if="selectExpressMode === '3'">
                        <a-alert type="warning" message="自提订单则派送到自提点" banner/>
                    </template>
                </a-col>
            </a-row>
        </div>
        <div>
            <a-checkbox>操作完成后自动跳转至下一笔待处理售后申请</a-checkbox>
        </div>
    </a-modal>
</template>

<script>
import util from '../../common/common'
import constant from "../../common/constant"
import config from '../../service/config.service'

export default {
    name: "RebateOrderDetailPageExpressDialog",
    props: {
        isShow: Boolean,
        loading: Boolean,
        order: Object
    },
    created() {
        config.getExpressConfig().then(res => {
            this.expressOptions = res.data.result
        })
    },
    data() {
        return {
            freightModel: constant.freightModel,
            expressOptions: [],
            selectExpressMode: '2',
            expressName: '',
            expressCode: '',
            products: [{
                title: '东野圭吾：圣女的救济（2020)',
                count: 1,
                img: 'https://img.yzcdn.cn/upload_files/2018/01/22/FnlHRufXMtUI_AbAEP0tux_nDL1T.png!small.webp'
            }]
        }
    },
    methods: {
        onConfirm() {
            if (this.selectExpressMode === '2') {
                if (util.TextExtend.String.isEmptyOrNull(this.expressName) || util.TextExtend.String.isEmptyOrNull(this.expressCode)) {
                    this.$message.warning('请填写物流信息')
                    return
                }
            }
            this.$emit('confirm', this.selectExpressMode, this.expressName, this.expressCode)
        }
    }
}
</script>

<style scoped>

</style>
