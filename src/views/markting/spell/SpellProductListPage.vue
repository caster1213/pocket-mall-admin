<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <div>
                        <a-button
                                @click="()=> $router.push({path:'/marketing/spell/product/add',query:{id:$route.query.id}}).then()"
                                class="font-size-12 p-input-right" type="primary">添加活动商品
                        </a-button>
                        <a-checkbox v-model="shelve" @change="getDataSource" class="font-size-12">只显示已上架</a-checkbox>
                    </div>
                    <div>
                        <a-input-search @search="getDataSource" v-model="productSearchName" placeholder="请输入商品名称">
                            <a-button class="font-size-12" slot="enterButton">
                                搜索
                            </a-button>
                        </a-input-search>
                    </div>
                </a-row>
            </div>
            <div class="p-table">
                <a-table rowKey="id" :pagination="false" :dataSource="dataSource" :columns="columns">
                    <template slot="action" slot-scope="val,row">
                        <a-button type="link" class="text-action-btn" @click="onOpenUpdateWindow(row)">编辑</a-button>
                        <a-button type="link" class="text-action-btn" @click="onDeleteItem(row)"
                                  style="margin-left: 5px">移除
                        </a-button>
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
                              @change="onNextPage"
                              @showSizeChange="onSizeChange"
                              :page-size-options="pageOption.pageSizeOption"></a-pagination>
            </a-row>
        </div>
        <a-modal :width="600" title="编辑商品" @cancel="()=> {
            updateWindowVisible=false
            form.resetFields()
        }" @ok="onUpdateProductHandler" :confirm-loading="loadOption.updateLoading"
                 :visible="updateWindowVisible">
            <a-form :form="form" :labelCol="{span:4}" :wrapperCol="{span:20}">
                <a-form-item class="text-row-1" label="商品名称">
                    <span class="font-size-12">{{current.name}}</span>
                </a-form-item>
                <a-form-item required class="font-size-12" label="活动价">
                    <a-input disabled="true" style="width: 150px" addon-after="元" v-decorator="['price']"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 销售价：¥{{current.price}}</span>
                </a-form-item>
                <a-form-item required label="剩余活动库存">
                    <a-input disabled="true" style="width: 150px" addon-after="件"
                             v-decorator="['inventorySource']"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 商品库存：{{current.inventory}}件</span>
                </a-form-item>
                <a-form-item required label="增减活动库存">
                    <a-input @change="onInventoryChange" style="width: 150px" addon-after="件" v-decorator="['inventory',{rules:[
                        {required:true,message:'必须填写活动库存'}]}]"></a-input>
                    <span style="margin-left: 5px" class="font-size-12 text-muted"> 正数为增加，负数减少。修改后库存：{{current.changeInventory}}件</span>
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
import constant from '../../../common/constant';
import common from '../../../common/common';

class SpellProduct {
  constructor() {
    this.id = 0
    this.name = ''
    this.price = 0
    this.spellPrice = 0
    this.inventory = 0
    this.spellInventory = 0
    this.index = 0
    this.changeInventory = 0
  }
}

export default {
  name: 'SpellProductListPage',
  data() {
    return {
      form: this.$form.createForm(this),
      columns: [{
        title: '商品名称',
        dataIndex: 'title'
      }, {
        title: '销售价',
        dataIndex: 'salePrice'
      }, {
        title: '拼团价',
        dataIndex: 'spellPrice'
      }, {
        title: '当前库存/活动库存',
        dataIndex: 'inventory',
        customRender(value, row) {
          return row.spellInventory + '/' + value
        }
      }, {
        title: '活动排序',
        dataIndex: 'index'
      }, {
        title: '操作',
        scopedSlots: {customRender: 'action'}
      }],
      shelve: false,
      productSearchName: '',
      pageOption: {
        pageIndex: 1,
        pageSize: 25,
        pageSizeOption: ['25', '50', '100'],
        pageTotal: 1
      },
      updateWindowVisible: false,
      loadOption: {
        pageLoading: false,
        updateLoading: false
      },
      dataSource: [],
      current: new SpellProduct()
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
        activityId: this.$route.query.id
      }
      if (this.shelve) {
        filter.productStatus = 1
      }
      if (this.productSearchName.length > 0) {
        filter.title = this.productSearchName
      }
      this.loadOption.pageLoading = true
      SpellActivityService.getProductList(filter).then(res => {
        this.pageOption.pageTotal = res.data.result.total
        this.dataSource = res.data.result.list
        this.loadOption.pageLoading = false
      })
    },
    onOpenUpdateWindow(row) {
      let product = new SpellProduct()
      product.id = row.id
      product.name = row.title
      product.index = row.index
      product.inventory = row.inventory
      product.spellInventory = row.spellInventory
      product.price = row.salePrice
      product.spellPrice = row.spellPrice
      product.changeInventory = row.spellInventory
      this.current = product
      this.updateWindowVisible = true
      this.form.getFieldDecorator('id', {initialValue: product.id, preserve: true})
      this.form.getFieldDecorator('price', {initialValue: product.spellPrice})
      this.form.getFieldDecorator('inventorySource', {initialValue: product.spellInventory})
      this.form.getFieldDecorator('inventory', {initialValue: 0})
      this.form.getFieldDecorator('index', {initialValue: product.index})
    },
    onUpdateProductHandler() {
      this.form.validateFields((err, value) => {
        if (err) return
        this.loadOption.updateLoading = true
        value.activityId = this.$route.query.id
        let request = {
          id: value.id,
          inventory: value.inventory,
          index: value.index
        }
        SpellActivityService.updateProduct(request).then(res => {
          this.loadOption.updateLoading = false
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success('编辑成功')
            this.updateWindowVisible = false
            this.form.resetFields()
            this.getDataSource()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    onInventoryChange(e) {
      let value = parseInt(e.target.value)
      if (isNaN(value) === false) {
        this.current.changeInventory = value + this.current.spellInventory
      }
    },
    onSizeChange() {
      this.pageIndex = 1
      this.getDataSource()
    },
    onNextPage(current) {
      this.pageOption.pageIndex = current
      this.getDataSource()
    },
    onDeleteItem(row) {
      this.$confirm({
        title: '删除提示',
        content: '确认从当前活动中移除此商品？',
        onOk: () => {
          return new Promise((resolve, reject) => {
            SpellActivityService.deleteProduct({id:row.id}).then(res => {
              if (common.isSuccess(res)) {
                this.$message.success('删除成功')
                this.getDataSource()
                return resolve()
              }else{
                this.$message.error(res.data.msg)
                return reject()
              }
            })

          })
        }
      })
    }
  }
}
</script>

<style scoped>
    @import "../../../assets/css/page-box.css";
    @import "../../../assets/css/table.css";
</style>
