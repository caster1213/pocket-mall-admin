<template>
    <div>
        <div>
            <a-button @click="()=> activityAddWindow= true">创建</a-button>
        </div>
        <div class="components-form-demo-advanced-search">
            <div class="search-result-list">
                <a-table
                        rowKey="id"
                        :columns="columns"
                        :loading="loading"
                        :dataSource="data"
                        :pagination="pagination"
                        @change="onChange"
                >
                    <template slot="action" slot-scope="val,row">
                        <a-popconfirm v-if="row.disable" @confirm="activate(row.id)" title="确认关闭活动？">
                            <a>关闭</a>
                        </a-popconfirm>
                        <a-popconfirm v-else @confirm="activate(row.id)" title="确认开启活动？">
                            <a>开启</a>
                        </a-popconfirm>
                        <router-link :to="{path:'/marketing/redenvelope/history',query:{activityId:row.id}}" style="margin-left: 5px">查看参与人数</router-link>
                    </template>
                </a-table>
            </div>
        </div>
        <a-modal title="创建活动" :loading="loading" @cancel="()=> activityAddWindow=false" :visible="activityAddWindow"
                 @ok="add">
            <a-form :form="addActivityForm">
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="名称">
                    <a-input v-decorator="['name',{rules:[{required:true,message:'必须活动名称'}]}]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="发放金额">
                    <a-input v-decorator="['amount',{rules:[{required:true,message:'必须发放金额'}]}]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="单个红包最大金额">
                    <a-input v-decorator="['maxAmount',{rules:[{required:true,message:'必须填写最大金额'}]}]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="单个红包最小金额">
                    <a-input v-decorator="['minAmount',{rules:[{required:true,message:'必须填写最小金额'}]}]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="活动开始时间">
                    <a-date-picker allowClear showTime v-decorator="['startDate',{rules:[{required:true,message:'必须填写活动开始时间'}]}]"></a-date-picker>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="持续时间(分钟)">
                    <a-input v-decorator="['minute',{rules:[{required:true,message:'必须填写持续时间'}]}]"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'
import ActivityService from '../../service/envelope.activity.service'

export default {
    name: 'Notice',
    data() {
        return {
            queryForm: this.$form.createForm(this),
            addActivityForm: this.$form.createForm(this),
            activityAddWindow: false,
            currentRow: null,
            loading: false,
            columns: [{
                title: '活动名称',
                dataIndex: 'name'
            }, {
                title: '总金额',
                dataIndex: 'amount'
            }, {
                title: '最大金额',
                dataIndex: 'maxAmount'
            }, {
                title: '最小金额',
                dataIndex: 'minAmount'
            }, {
                title: '状态',
                dataIndex: 'disable',
                customRender(value) {
                    if (value) {
                        return '开启'
                    } else {
                        return '关闭'
                    }
                }
            }, {
                title: '开始日期',
                dataIndex: 'startDate',
                customRender(value) {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                title: '结束日期',
                dataIndex: 'endDate',
                customRender(value) {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                title: '创建日期',
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
            this.loading = true
            ActivityService.list(value).then(res => {
                this.data = res.data.result.list
                this.pagination.total = res.data.result.total
                this.loading = false
            })
        },
        add() {
            this.loading = true
            this.addActivityForm.validateFields((error, value) => {
                if (error != null) return
                this.loading = true
                value.startDate = value.startDate.format('YYYY-MM-DD HH:ss:ss')
                ActivityService.add(value).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('添加成功')
                        this.load()
                        this.activityAddWindow = false
                    }
                })
            })
        },
        activate(id) {
            ActivityService.disable({id: id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('操作成功')
                    this.load()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
