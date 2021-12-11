<template>
    <div class="components-form-demo-advanced-search">
        <a-form class="select-form"
                :form="queryForm"
                @submit="query">
            <a-row :gutter="24">
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="订单搜索">
                        <a-input-group compact>
                            <a-select v-decorator="['orderSearchKey',{initialValue:'orderNumber'}]">
                                <a-select-option value="orderNumber">
                                    订单编号
                                </a-select-option>
                                <a-select-option value="orderPhone">
                                    下单人电话
                                </a-select-option>
                                <a-select-option value="orderName">
                                    下单人姓名
                                </a-select-option>
                                <a-select-option value="contactPhone">
                                    收货人电话
                                </a-select-option>
                                <a-select-option value="contactName">
                                    收货人姓名
                                </a-select-option>
                                <a-select-option value="productTitle">
                                    商品名称
                                </a-select-option>
                            </a-select>
                            <a-input style="width: 65%"
                                     v-decorator="['orderSearchValue']" />
                        </a-input-group>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="订单状态">
                        <a-select allowClear
                                  v-decorator="['orderState']">
                            <a-select-option value="1">待支付</a-select-option>
                            <a-select-option value="2">待发货</a-select-option>
                            <a-select-option value="3">已发货</a-select-option>
                            <a-select-option value="4">已收货</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="下单日期">
                        <a-range-picker format="YYYY-MM-DD HH:mm:ss"
                                        showTime
                                        v-decorator="['createDate']" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="营销类型">
                        <a-select allowClear
                                  v-decorator="['orderGenre',{initialValue:'1'}]">
                            <a-select-option value="1">不限</a-select-option>
                            <a-select-option value="2">拼团</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24"
                       :style="{ textAlign: 'right' }">

                    <a-button :loading="loading"
                              type="primary"
                              html-type="submit">
                        查询
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }"
                              @click="reset">
                        重置
                    </a-button>
                    <a-button @click="exportOrder"
                              :style="{ marginLeft: '8px' }">导出
                    </a-button>
                </a-col>
            </a-row>
        </a-form>
        <div class="search-result-list">
            <a-table rowKey="orderNumber"
                     :columns="columns"
                     :loading="loading"
                     :dataSource="data"
                     :scroll="{x:2000}"
                     :pagination="pagination"
                     @change="onChange">
                <template slot="product"
                          slot-scope="value,row">
                    <div :title="row.productTitle" style="display: flex;height: 50px;width: 300px">
                        <div style="">
                            <img style="width: 50px;height: 50px" :src="row.productImage" />
                        </div>
                        <div style="overflow: hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient: vertical;word-break: break-all; text-overflow:ellipsis;padding-left: 5px;font-size: 13px;line-height: 25px">
                            {{row.productTitle}}
                        </div>
                    </div>
                </template>
                <template slot="action"
                          slot-scope="value,row">
                    <a @click="()=>{
                        orderDeliveryWindow = true
                        currentRow = row
                    }">发货</a>
                    <a-popconfirm @confirm="delOrder(row.orderNumber)"
                                  title="确认删除此订单？">
                        <a style="margin-left: 5px">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </div>
        <a-modal title="发货"
                 v-model="orderDeliveryWindow"
                 okText="提交"
                 :confirmLoading="loading"
                 @ok="deliveryHandler">
            <a-form :form="deliveryForm">
                <a-form-item>
                    <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}"
                                 :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                                 label="快递公司">
                        <a-input v-decorator="[
            'expressName',
            {
              rules:[{
                  required:true,message:'必须填写快递公司'
              }]
            }
            ]"></a-input>
                    </a-form-item>
                </a-form-item>
                <a-form-item>
                    <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}"
                                 :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                                 label="快递单号">
                        <a-input v-decorator="[
            'expressCode',
            {
              rules:[{
                  required:true,message:'必须填写快递单号'
              }]
            }
            ]"></a-input>
                    </a-form-item>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'
import OrderService from '../../service/order.service'

export default {
  name: 'OrderList',
  data() {
    return {
      queryForm: this.$form.createForm(this),
      orderDeliveryWindow: false,
      deliveryForm: this.$form.createForm(this),
      loading: false,
      currentRow: null,
      columns: [{
        title: '商品',
        scopedSlots: {customRender: 'product'},
        width: '310px'
      }, {
        title: '订单号',
        dataIndex: 'orderNumber',
      }, {
        title: '下单人',
        dataIndex: 'orderName',
      }, {
        title: '下单人手机',
        dataIndex: 'orderPhone',
      }, {
        title: '订单金额',
        dataIndex: 'totalPrice',
      }, {
        title: '支付金额',
        dataIndex: 'payPrice',
      }, {
        title: '订单状态',
        dataIndex: 'orderState',
        customRender(value) {
          switch (value) {
            case 1:
              return '待支付'
            case 2:
              return '待发货'
            case 3:
              return '已发货'
            case 4:
              return '已完成'
            case -1:
              return '已取消'
            case -2:
              return '已关闭'

          }
        }
      }, {
        title: '收货地址',
        customRender(value, row) {
          return row.provinceId + row.cityId + row.districtId + row.detailAddress
        }
      }, {
        title: '收货人',
        dataIndex: 'contactName',
      }, {
        title: '收货人电话',
        dataIndex: 'contactPhone',
      }, {
        title: '下单日期',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '收货日期',
        dataIndex: 'applyDate',
        customRender(value, row) {
          if (row.orderState === 4) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
          } else {
            return '暂无'
          }

        }
      }, {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        scopedSlots: {customRender: 'action'}
      }],
      data: [],
      pagination: {
        pageSizeOptions: ['15', '35', '50'],
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 15,
        defaultPageSize: 15,
        current: 1,
        showTotal: total => {
          let pageNum = Math.ceil(total / this.pagination.pageSize)
          return '共 ' + pageNum + '页' + '/' + total + ' 条数据'
        }
      }
    }
  },
  created() {
    this.load()
  },
  computed: {
    roleName() {
      return this.$store.state.role
    }
  },
  methods: {
    query(e) {
      e.preventDefault()
      this.load()
    },
    reset() {
      this.queryForm.resetFields()
    },
    getFilterOption() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()
      let value = Object.assign(query, input)
      value[input.orderSearchKey] = input.orderSearchValue
      if (input.createDate !== undefined) {
        value.createDateStart = input.createDate[0].format('YYYY-MM-DD HH:mm:ss')
        value.createDateEnd = input.createDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
    },
    onChange(event) {
      this.pagination.current = event.current
      this.pagination.pageSize = event.pageSize
      this.load()
    },
    load() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()
      let value = Object.assign(query, input)
      value[input.orderSearchKey] = input.orderSearchValue
      if (input.createDate !== undefined) {
        value.createDateStart = input.createDate[0].format('YYYY-MM-DD HH:mm:ss')
        value.createDateEnd = input.createDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
      this.loading = true
      OrderService.list(value).then(res => {
        this.data = res.data.result.list
        this.pagination.total = res.data.result.total
        this.loading = false
      })
    },
    deliveryHandler() {
      this.loading = true
      let request = this.deliveryForm.getFieldsValue()
      request.orderNumber = this.currentRow.orderNumber
      OrderService.deliver(request).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.currentRow.orderState = 3
          this.deliveryForm.resetFields()
          this.orderDeliveryWindow = false
          this.$message.success('发货成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    delOrder(e) {
      OrderService.del({orderNumber: e}).then(res => {
        if (res.data.code === 0) {
          this.load()
        }
      })
    },
    exportOrder() {
      OrderService.export(this.getFilterOption()).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
</style>
