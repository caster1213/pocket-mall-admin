<template>
    <div>
        <div>
            <div class="p-box p-box-bg-gary" style="height: 70px">
                <span style="text-align: left;">
                    <span class="h4" style="line-height: 50px;margin-left: 15px">商家配送</span>
                    <span style="line-height: 50px; margin-left: 10px">
                        <a-switch :loading="loadOption.isOpenLoading" v-model="config.isOpen"
                                  @change="onChangeFreightOpen" color="green"></a-switch>
                    </span>
                    <span style="line-height: 50px;margin-left: 10px;color: #9797A1;font-size: 12px">
                        {{openText}}
                    </span>
                </span>
            </div>
            <div class="p-box p-box-bg-gary over">
                <a-tabs size="small" :tabBarStyle="{border:'0px'}" v-model="tabIndex" @change="onTabChange">
                    <a-tab-pane :key="tabName.template" tab="运费模板">
                        <div class="p-box p-box-bg-white">
                           <span>
                               <a-button @click="()=> $router.push({name:'addFreightTemplate'})" class="font-size-12">创建运费模板</a-button>
                               <span class="font-size-12 font-color-9797a1" style="margin-left: 10px">开启商家配送的商户需设置，最多可创建100个</span>
                           </span>
                        </div>
                        <div v-for="(row,index) in rows" :key="index" class="panel">
                            <a-spin :delay="1000" :spinning="loadOption.pageLoading"/>
                            <table>
                                <thead>
                                <tr>
                                    <td colspan="5">
                                        <span style="float: left" class="font-bold">{{row.name}}</span>
                                        <span style="float: right">
                                             <span v-if="row.isDefault" style="color: #FF8C00;margin-right: 40px"
                                                   class="font-bold h5">新品默认模板
                                             </span>
                                            <span v-else style="margin-right: 40px" class="font-color-9797a1">
                                                <a-checkbox
                                                        @change="setDefaultTemplate(index)">
                                                    <span class="font-size-12">默认模板</span>
                                                </a-checkbox>
                                            </span>
                                            <span style="margin-right: 40px" class="font-color-9797a1">使模板的商品：{{row.useCount}}个</span>
                                            <span style="margin-right: 40px" class="font-color-9797a1">最后编辑时间：{{row.updateDate}}</span>
                                            <span style="margin-right: 40px" class="font-color-9797a1">
                                                <a-popconfirm title="确认当前模板没有其他商品中使用" @confirm="delTemplate(row.id)">
                                                    <a style="padding-right: 5px">删除</a>
                                                </a-popconfirm>

                                                <router-link tag="a"
                                                             :to="{path:'/setting/delivery/freight/template/update',query:{id:row.id}}"
                                                             style="padding-right: 5px">编辑</router-link>
                                                <a style="padding-right: 5px">复制</a>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 40%">可配送区域</td>
                                    <td>首{{row.unitText}}</td>
                                    <td>运费(元)</td>
                                    <td>续{{row.unitText}}</td>
                                    <td>续费(元)</td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in row.items" :key="item.id">
                                    <td>{{item.districtName}}</td>
                                    <td>{{item.freightUnit}}</td>
                                    <td>{{item.firstPrice}}</td>
                                    <td>{{item.nextFreightUnit}}</td>
                                    <td>{{item.nextPrice}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane :key="tabName.rule" tab="配送规则">
                        <div class="p-box p-box-bg-white">
                            <a-row type="flex" justify="center">
                                <a-form style="width: 80%" :form="expressFreightConfigForm" :labelCol="{span:3}"
                                        :wrapperCol="{span:15}">
                                    <a-form-item label="自定义名称">
                                        <a-input v-decorator="['name']" style="width: 200px"></a-input>
                                        <span style="margin-left: 15px" class="font-size-12 font-color-9797a1">在前台显示的自定义名称，最多10个字</span>
                                    </a-form-item>
                                    <a-form-item label="默认配送方式">
                                        <a-switch v-decorator="['isDefault',{valuePropName: 'checked'}]"></a-switch>
                                        <span style="margin-left: 15px" class="font-size-12 font-color-9797a1">买家下单时，默认[商家配送]作为默认配送方式</span>
                                    </a-form-item>
                                    <a-form-item label="自定义配送时间">
                                        <a-switch @change="onCustomTime"
                                                  v-decorator="['isCustomDeliveryTime',{ valuePropName: 'checked' }]"></a-switch>
                                        <span style="margin-left: 15px" class="font-size-12 font-color-9797a1">开启自定义配送时间后，买家在下单时，可选择配送日期</span>
                                        <a-row v-show="customTimeChecked" style="padding: 10px 0" type="flex">
                                            <a-radio-group @change="onCustomDeliveryTime"
                                                           v-decorator="['customDeliveryType']">
                                                <a-radio class="font-size-12" value="1">使用固定配送时间选项</a-radio>
                                                <a-radio class="font-size-12" value="2">自定义配送时间选项</a-radio>
                                            </a-radio-group>
                                        </a-row>
                                        <a-row v-if="customDeliveryTimeType === customDeliveryTimeOption.fixed && customTimeChecked ===true"
                                               type="flex">
                                            <span class="font-size-12">工作日、双休日或节假日可送货/只工作日送货/只双休日、节假日送货</span>
                                        </a-row>
                                        <a-row v-if="customDeliveryTimeType === customDeliveryTimeOption.time && customTimeChecked ===true"
                                               class="p-box p-box-bg-gary" justify="center" type="flex">
                                            <div style="width: 100%">
                                                <a-form-item required :labelCol="{span:5,offset:3}"
                                                             :wrapperCol="{span:12}" requried label="最早可配送时间,下单后">
                                                    <a-input style="height: 30px;width: 200px" v-decorator="['firstDay',{rules:[
                                                        {required:true,message:'必须填写'},
                                                        {pattern: /^([1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"></a-input>
                                                    <span style="margin-left: 15px"
                                                          class="font-size-12 font-color-9797a1">天,可送货上门</span>
                                                </a-form-item>
                                                <a-form-item required :labelCol="{span:5,offset:3}"
                                                             :wrapperCol="{span:12}" requried label="最晚可配送时间,下单后">
                                                    <a-input style="height: 30px;width: 200px" v-decorator="['lastDay',{rules:[
                                                        {required:true,message:'必须填写'},
                                                        {pattern: /^([1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"></a-input>
                                                    <span style="margin-left: 15px"
                                                          class="font-size-12 font-color-9797a1">天,可送货上门</span>
                                                </a-form-item>
                                            </div>
                                        </a-row>
                                    </a-form-item>
                                    <a-form-item label="运费组合策略">
                                        <a-tooltip>
                                            <template slot="title">
                                                <p>
                                                    例：订单中存在两个包裹对应不同的运费模板（a模板对应α包裹，b模板对应β包裹），a模板运费10，b模板的运费5；且商家没有设置满减邮等邮费减免的营销活动</p>
                                                <p>a、用户选择叠加策略，，本单运费为10+5=15</p>
                                                <p>b、用户使用以最低运费结算，单运费为5＜10→5元</p>
                                                <p>b、用户使用以最高运费结算，本单运费为5＜10→10元</p>
                                            </template>
                                            <a class="font-size-12">运费计费规则</a>
                                        </a-tooltip>
                                        <div class="p-box p-box-bg-gary">
                                            <a-radio-group v-decorator="['rule']">
                                                <a-radio value="1"
                                                         style="display: block;height: 30px;line-height: 30px">
                                                    <span class="font-size-12">叠加</span>
                                                    <span style="margin-left: 90px" class="font-size-12">订单中的商品有多个运费模板时，将每个商品的运费之和订为订单总运费</span>
                                                </a-radio>
                                                <a-radio value="2"
                                                         style="display: block;height: 30px;line-height: 30px">
                                                    <span class="font-size-12">以最低运费结算</span>
                                                    <span style="margin-left: 30px" class="font-size-12">订单中的商品有多个运费模板时，取订单中运费最少的商品的运费计为订单总运费</span>
                                                </a-radio>
                                                <a-radio value="3"
                                                         style="display: block;height: 30px;line-height: 30px">
                                                    <span class="font-size-12">以最高运费结算</span>
                                                    <span style="margin-left: 30px" class="font-size-12">订单中的商品有多个运费模板时，取订单中运费最多的商品的运费计为订单总运费</span>
                                                </a-radio>
                                            </a-radio-group>
                                        </div>
                                    </a-form-item>
                                </a-form>
                            </a-row>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <p-footer-page v-if="tabIndex===tabName.template" :page-index="pageOption.pageIndex"
                       :page-size="pageOption.pageSize"
                       :page-total="pageOption.pageTotal"
                       :page-size-option="pageOption.pageSizeOption"
                       @nextPage="onNextPage" @nextPageSize="onNextPageSize">
        </p-footer-page>
        <div class="p-footer" v-else>
            <a-row style="height: 100%" type="flex" justify="center" align="middle">
                <div>
                    <a-button :loading="loadOption.configSaveLoading" class="font-size-12" @click="onSaveChange"
                              type="primary">保存
                    </a-button>
                </div>
            </a-row>
        </div>
    </div>
</template>

<script>
import freightTemplateService from "../../../service/freightTemplateService";
import moment from 'moment'
import constant from '../../../common/constant'
export default {
    name: "DeliverySetting",
    computed: {
        openText() {
            return this.config.isOpen ? '已开启' : '已关闭'
        }
    },
    data() {
        return {
            activeIndex: 1,
            tabIndex: '1',
            tabName: {
                template: '1',
                rule: '3'
            },
            loadOption: {
                pageLoading: false,
                configSaveLoading: false,
                isOpenLoading: false
            },
            config: {isDefault: false, isOpen: false},
            customTimeChecked: false,
            customDeliveryTimeType: constant.customDeliveryTimeOption.fixed,
            customDeliveryTimeOption: constant.customDeliveryTimeOption,
            expressFreightConfigForm: this.$form.createForm(this),
            rows: [],
            defaultTemplate: null,
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 0,
                pageSizeOption: ['25', '50', '100']
            }
        }
    },
    created() {
        this.onActivated(1)
        this.getPageData()
    },
    methods: {
        onChangeFreightOpen(e) {
            this.loadOption.isOpenLoading = true
            freightTemplateService.openOrClose().then(res => {
                this.loadOption.isOpenLoading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.config.isOpen = e
                } else {
                    this.$message.success(res.data.msg)
                }
            })
        },
        onSaveChange() {
            this.expressFreightConfigForm.validateFields((err, value) => {
                if (err) return
                this.loadOption.configSaveLoading = true
                freightTemplateService.updateConfig(value).then(res => {
                    this.loadOption.configSaveLoading = false
                    if (res.data.code === constant.serviceCode.success) {
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        onCustomTime(e) {
            this.customTimeChecked = e
        },
        onCustomDeliveryTime(e) {
            this.customDeliveryTimeType = parseInt(e.target.value)
        },
        onActivated(index) {
            this.activeIndex = index
        },
        onTabChange() {
            console.log(this.tabIndex)
        },
        getPageData() {
            this.loadOption.pageLoading = true
            freightTemplateService.list({
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize
            }).then(res => {
                this.loadOption.pageLoading = false
                this.rows = res.data.result.page.list
                this.config = res.data.result.config
                this.pageOption.pageTotal = res.data.result.page.total
                this.defaultTemplate = res.data.result.page.list.find(x => x.isDefault)
                this.bindConfig()
                this.rows.forEach(x => {
                    x.updateDate = moment(x.updateDate).format('YYYY-MM-DD HH:mm:ss')
                    switch (x.freightChargeType) {
                        case constant.freightChargeType.number:
                            x.unitText = '件(个)'
                            break
                        case constant.freightChargeType.weight:
                            x.unitText = '重(kg)'
                            break
                        default:
                            x.unitText = '体积(m³)'
                            break
                    }
                })
            })
        },
        bindConfig() {
            this.expressFreightConfigForm.getFieldDecorator('name', {initialValue: this.config.name})
            this.expressFreightConfigForm.getFieldDecorator('isDefault', {initialValue: this.config.isDefault})
            this.expressFreightConfigForm.getFieldDecorator('isCustomDeliveryTime', {initialValue: this.config.isCustomDeliveryTime})
            this.expressFreightConfigForm.getFieldDecorator('customDeliveryType', {initialValue: this.config.customDeliveryType.toString()})
            this.expressFreightConfigForm.getFieldDecorator('rule', {initialValue: this.config.rule.toString()})
            if (this.config.isCustomDeliveryTime) {
                this.customTimeChecked = true
                this.customDeliveryTimeType = this.config.customDeliveryType
            }
            if (this.customDeliveryTimeType === constant.customDeliveryTimeOption.time && this.customTimeChecked) {
                if (this.config.firstDay > 0) {
                    this.expressFreightConfigForm.getFieldDecorator('firstDay', {initialValue: this.config.firstDay})
                }
                if (this.config.lastDay > 0) {
                    this.expressFreightConfigForm.getFieldDecorator('lastDay', {initialValue: this.config.lastDay})
                }
            }

        },
        delTemplate(id) {
            freightTemplateService.del({id: id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('删除成功')
                    this.getPageData()
                } else {
                    this.$message.error(res.data.result.msg)
                }
            })
        },
        setDefaultTemplate(index) {
            let id = this.rows[index].id
            freightTemplateService.defaultTemplate({id: id}).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('更新成功')
                    this.getPageData()
                }
            })
        },
        onNextPage(index) {
            this.pageOption.pageIndex = index
            this.getPageData()
        },
        onNextPageSize(index, size) {
            this.pageOption.pageSize = size
            this.pageIndex = 1
            this.getPageData()
        }
    }
}
</script>

<style scoped>
    .over /deep/ .ant-tabs-tab {
        margin: 0 10px 0 0;
    }

    table {
        font-size: 12px;
        width: 100%;
    }

    table > thead > tr:first-child {
        height: 50px;
        background-color: #Fff;
    }

    table > thead > tr:nth-child(2) {
        border-top: 1px solid #ddd;
    }

    table > thead > tr:first-child > td {
        padding: 15px;
    }

    table > thead > tr:nth-child(2) > td {
        padding: 15px;
        height: 50px;
    }

    table > tbody > tr {
        border-top: 1px solid #ededef;
        padding-left: 15px;
    }

    table > tbody > tr > td {
        padding: 15px;
        vertical-align: top;
        height: 50px;
    }
</style>
