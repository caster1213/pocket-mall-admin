<template>
    <div>
        <div class="components-form-demo-advanced-search">
            <div class="search-result-list">
                <a-table
                        rowKey="key"
                        :columns="columns"
                        :loading="loading"
                        :dataSource="data"
                        :pagination="false"
                >
                    <template slot="action" slot-scope="value,row">
                        <a @click="open(row)">更新</a>
                    </template>
                </a-table>
            </div>
        </div>
        <a-modal
                title="更新"
                v-model="updateVisibleModal"
                okText="确认"
                :confirmLoading="loading"
                @ok="updateHandler"
        >
            <a-form
                    :form="updateForm"
            >
                <a-form-item>
                    <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                                 label="参数内容">
                        <a-input v-decorator="[
            'value',
            {
              rules:[{
                  required:true,message:'必须填写参数内容'
              }]
            }
            ]"></a-input>
                    </a-form-item>
                </a-form-item>
                <a-form-item>
                    <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                                 label="参数描述">
                        <a-input v-decorator="[
            'description',
            {
              rules:[{
                  required:true,message:'必须填写参数描述'
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
import CommonService from '../../service/common.service'

export default {
    name: 'FieldConfig',
    data() {
        return {
            pageInfo: {
                pageSizeOptions: ['15', '35', '100'],
                total: 0,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSize: 15,
                defaultPageSize: 15,
                current: 1,
                showTotal: total => {
                    let pageNum = Math.ceil(total / this.pageInfo.pageSize)
                    return '共 ' + pageNum + '页' + '/' + total + ' 条数据'
                }
            },
            data: [],
            columns: [{
                title: '参数内容',
                dataIndex: 'value'
            }, {
                title: '参数描述',
                dataIndex: 'description'
            }, {
                title: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'}
            }],
            loading: false,
            updateVisibleModal: false,
            currentRow: null,
            createForm: this.$form.createForm(this),
            updateForm: this.$form.createForm(this)
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            this.loading = true
            CommonService.getFieldConfig().then(rep => {
                this.loading = false
                if (rep.data.code === 0) {
                    this.data = rep.data.result
                }
            })
        },
        open(row) {
            this.updateVisibleModal = true
            this.currentRow = row
            setTimeout(()=>{
                this.updateForm.setFieldsValue({
                    value:row.value,
                    description:row.description
                })
            },100)
        },
        filter() {

        },
        updateHandler() {
            this.updateForm.validateFields((error, values) => {
                if (error !== null) {
                    return
                }
                this.loading = true
                CommonService.updateFieldConfig({
                    key: this.currentRow.key,
                    value: values.value,
                    description: values.description
                }).then(rep => {
                    this.loading = false
                    if (rep.data.code === 0) {
                        this.$message.success('更新成功')
                        this.updateVisibleModal = false
                        this.load()
                    }
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
