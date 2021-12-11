<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <div>
                        <a-button @click="()=>$router.back()" class="p-input-right font-size-12" type="primary">返回管理商品
                        </a-button>
                        <a-checkbox @change="getDataSource" v-model="shelve" class="font-size-12">只显示已上架</a-checkbox>
                    </div>
                    <div>
                        <label class="font-size-12 p-input-right">销售价格</label>
                        <a-input @change="onMinPriceChange" v-model="minPrice" class="p-input-right"
                                 style="width: 50px"></a-input>
                        <label class="font-size-12 p-input-right">-</label>
                        <a-input @change="onMaxPriceChange" v-model="maxPrice" class="p-input-right"
                                 style="width: 50px"></a-input>
                        <a-input-search @search="getDataSource" v-model="productSearchName" style="width: 200px"
                                        placeholder="请输入商品名称">
                            <a-button class="font-size-12" slot="enterButton">
                                搜索
                            </a-button>
                        </a-input-search>
                    </div>
                </a-row>
            </div>
            <div class="p-table">
                <a-table rowKey="id" :dataSource="dataSource" :loading="loadOption.pageLoading" :pagination="false"
                         :columns="columns">
                    <template slot="action" slot-scope="val,row">
                        <a v-if="row.attrs.length === 0" @click="onOpenAddProductWindow(row)">添加</a>
                    </template>
                </a-table>
            </div>
        </div>
        <div class="p-footer">
            <a-row style="height: 100%" type="flex" justify="center" align="middle">
                <a-pagination show-quick-jumper show-size-changer
                              v-model="pageOption.pageIndex"
                              :default-current="1"
                              :page-size.sync="pageOption.pageSize"
                              :total="pageOption.pageTotal"
                              @showSizeChange="onSizeChange"
                              @change="onNextPage"
                              :page-size-options="pageOption.pageSizeOption"></a-pagination>
            </a-row>
        </div>
        <a-modal title="添加商品" @cancel="()=> {
            addWindowVisible=false
            form.resetFields()
        }" @ok="onAddProductHandler" :confirm-loading="loadOption.addLoading"
                 :visible="addWindowVisible">
            <a-form :form="form" :labelCol="{span:4}" :wrapperCol="{span:20}">
                <a-form-item class="text-row-1" label="商品名称">
                    <span class="font-size-12">{{current.name}}</span>
                </a-form-item>
                <a-form-item required class="font-size-12" label="活动价">
                    <a-input style="width: 150px" addon-after="元" v-decorator="['price',{rules:[
                        {required:true,message:'必须填写活动价'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 销售价：¥{{current.price}}</span>
                </a-form-item>
                <a-form-item required label="活动库存">
                    <a-input style="width: 150px" addon-after="件" v-decorator="['inventory',{rules:[
                        {required:true,message:'必须填写活动库存'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字,小数点最多保留2位'},
                        {validator:(rule,value,callback)=>{
                            if(parseInt(value)<=parseInt(current.inventory)){
                                callback()
                            }else{
                                callback('请输入小于等于'+current.inventory+'数值')
                            }
                        },message:''}
                        ]}]"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 商品库存：{{current.inventory}}件</span>
                </a-form-item>
                <a-form-item label="活动排序">
                    <a-input style="width: 150px" v-decorator="['index']"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 不填写，默认按后添加的在前</span>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import SpellActivityService from '../../../service/spell.activity.service'
import ActivityService from '../../../service/activity.service'
import moment from 'moment'
import constant from "../../../common/constant";

export default {
    name: "SpellProductAddPage",
    data() {
        return {
            form: this.$form.createForm(this),
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageSizeOption: ['25', '50', '100'],
                pageTotal: 1
            },
            shelve: false,
            productSearchName: '',
            minPrice: '',
            maxPrice: '',
            loadOption: {
                pageLoading: false,
                addLoading: false
            },
            addWindowVisible: false,
            columns: [{
                title: '商品名称',
                dataIndex: 'title'
            }, {
                title: '销售价格',
                dataIndex: 'salePrice'
            }, {
                title: '商品状态',
                dataIndex: 'productStatue',
                customRender(value) {
                    return value === 1 ? '上架' : '下架'
                },
            }, {
                title: '实际销量',
                dataIndex: 'saleCount'
            }, {
                title: '商品库存',
                dataIndex: 'inventory'
            }, {
                title: '操作',
                scopedSlots: {customRender: 'action'}
            }],
            dataSource: [],
            current: {
                name: '',
                price: 0,
                inventory: 0
            }
        }
    },
    created() {
        this.getDataSource()
    },
    methods: {
        getDataSource() {
            let filter = {
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize,
                title: this.productSearchName
            }
            if (this.shelve) {
                filter.productStatus = 1
            }
            if (this.productSearchName.length > 0) {
                filter.title = this.productSearchName
            }
            if (this.minPrice.length > 0 && this.maxPrice.length > 0) {
                filter.minPrice = this.minPrice
                filter.maxPrice = this.maxPrice
            }
            this.loadOption.pageLoading = true
            ActivityService.getProductList(filter).then(res => {
                this.loadOption.pageLoading = false
                this.pageOption.pageTotal = res.data.result.total
                this.dataSource = res.data.result.list
            })
        },
        onOpenAddProductWindow(row) {
            this.addWindowVisible = true
            this.current.name = row.title
            this.current.price = row.salePrice
            this.current.inventory = row.inventory
            this.form.getFieldDecorator('productId', {initialValue: row.id, preserve: true})
        },
        onAddProductHandler() {
            this.form.validateFields((err, value) => {
                if (err) return
                this.loadOption.addLoading = true
                value.activityId = this.$route.query.id
                SpellActivityService.addProduct(value).then(res => {
                    this.loadOption.addLoading = false
                    if (res.data.code === constant.serviceCode.success) {
                        this.$message.success('添加成功')
                        this.addWindowVisible = false
                        this.form.resetFields()
                        this.getDataSource()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        onNextPage(current) {
            this.pageOption.pageIndex = current
            this.getDataSource()
        },
        onMinPriceChange(e) {
            let r = /^(0|[1-9][0-9]*)$/
            if (r.test(e.data) === false) {
                this.minPrice = this.minPrice.substring(0, this.minPrice.length - 1)
            }
        },
        onMaxPriceChange(e) {
            let r = /^(0|[1-9][0-9]*)$/
            if (r.test(e.data) === false) {
                this.maxPrice = this.maxPrice.substring(0, this.maxPrice.length - 1)
            }
        },
        onSizeChange() {
            this.pageIndex = 1
            this.getDataSource()
        }
    }
}
</script>

<style scoped>
    @import "../../../assets/css/page-box.css";
    @import "../../../assets/css/table.css";
</style>
