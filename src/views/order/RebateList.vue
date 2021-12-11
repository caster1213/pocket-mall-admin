<template>
    <div class="components-form-demo-advanced-search">
        <a-form
                class="select-form"
                :form="queryForm"
                @submit="query"
        >
            <a-row :gutter="24">
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="订单号">
                        <a-input v-decorator="['rebateCode']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="申请人">
                        <a-input v-decorator="['order']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="申请人电话">
                        <a-input v-decorator="['name']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="申请时间">
                        <a-range-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                                v-decorator="['createDate']"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col
                        :span="24"
                        :style="{ textAlign: 'right' }"
                >
                    <a-button
                            :loading="loading"
                            type="primary"
                            html-type="submit"
                    >
                        查询
                    </a-button>
                    <a-button
                            :style="{ marginLeft: '8px' }"
                            @click="reset"
                    >
                        重置
                    </a-button>
                </a-col>
            </a-row>
        </a-form>
        <div class="search-result-list">
            <a-table
                    rowKey="id"
                    :columns="columns"
                    :loading="loading"
                    :dataSource="data"
                    :pagination="pagination"
                    @change="onChange"
            >
                <template slot="action" slot-scope="v,row">
                    <a-popconfirm title="确认退款申请通过？" v-if="row.state ===1" @confirm="approve(row)">
                        <a>审核</a>
                    </a-popconfirm>
                    <a-popconfirm title="确认收到买家退货商品？" v-if="row.state ===3" @confirm="confirm(row)">
                        <a>确认收货</a>
                    </a-popconfirm>
                    <a-popconfirm title="确认给买家进行退款？" v-if="row.state ===4" @confirm="completed(row)">
                        <a >退款</a>
                    </a-popconfirm>
                    <a style="margin-left: 5px"  @click="()=> {
                        currentRow = row
                        refuseWindow = true
                    }" v-if="row.state >=1 && row.state <=4">拒绝</a>
                    <a style="margin-left: 5px">查看</a>
                </template>
            </a-table>
        </div>
        <a-modal
                title="退货驳回"
                v-model="refuseWindow"
                okText="提交"
                :confirmLoading="loading"
                @ok="refuse"
        >
            <a-form
                    :form="refuseForm"
            >
                <a-form-item>
                    <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                                 label="驳回原因">
                        <a-input v-decorator="[
                        'message',
                        {
                          rules:[{
                              required:true,message:'必须填写拒绝理由'
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
import OrderService from '../../service/order.rebate.service'

export default {
    name: 'RebateList',
    data() {
        return {
            queryForm: this.$form.createForm(this),
            refuseForm: this.$form.createForm(this),
            currentRow: null,
            refuseWindow:false,
            loading: false,
            columns: [{
                title: '服务号',
                dataIndex: 'refundCode'
            }, {
                title: '下单人',
                dataIndex: 'orderName'
            }, {
                title: '下单人手机',
                dataIndex: 'orderPhone'
            }, {
                title: '退款金额',
                dataIndex: 'applyAmount'
            }, {
                title: '支付方式',
                dataIndex: 'payType',
                customRender(value) {
                    switch (value) {
                        case 1:
                            return ' 微信支付'
                        case 2:
                            return '余额支付'
                    }
                }
            }, {
                title: '订单状态',
                dataIndex: 'state',
                customRender(value) {
                    switch (value) {
                        case 1:
                            return '待审核'
                        case 2:
                            return '已通过'
                        case 3:
                            return '已发货'
                        case 4:
                            return '已收货'
                        case 5:
                            return '已打款'
                        case -1:
                            return '拒绝'
                        case -2:
                            return '关闭'
                    }
                }
            }, {
                title: '退款理由',
                dataIndex: 'reason'
            }, {
                title: '退款描述',
                dataIndex: 'description'
            }, {
                title: '快递公司',
                dataIndex: 'expressName'
            }, {
                title: '快递单号',
                dataIndex: 'expressCode'
            }, {
                title: '申请日期',
                dataIndex: 'createDate',
                customRender(value) {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                title: '操作',
                dataIndex: 'action',
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
        approve(obj) {
            OrderService.approve({id: obj.id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('操作完成！')
                    obj.state = 2
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        refuse() {
            this.refuseForm.validateFields((error,value)=>{
                if(error !== null) return
                let request = value
                request.id = this.currentRow.id
                OrderService.refuse(request).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('操作完成！')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        confirm(obj) {
            OrderService.confirm({id: obj.id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('操作完成！')
                    obj.state = 4
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        completed(obj) {
            OrderService.completed({id: obj.id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('操作完成！')
                    obj.state = 5
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
