<template>
    <div>
        <a-form
                class="select-form"
                :form="queryForm"
                @submit="query"
        >
            <a-row :gutter="24">
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="姓名">
                        <a-input v-decorator="['nickname']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}" :md="{span:8}">
                    <a-form-item label="电话">
                        <a-input v-decorator="['phone']"></a-input>
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
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import ActivityService from "../../service/spell.activity.service";

export default {
    name: "RedEnvelopeHistory",
    data() {
        return {
            queryForm: this.$form.createForm(this),
            loading: false,
            columns: [{
                title: '参与人姓名',
                dataIndex: 'nickname'
            }, {
                title: '参与人电话',
                dataIndex: 'phone'
            }, {
                title: '领取金额',
                dataIndex: 'amount'
            }, {
                title: '参与日期',
                dataIndex: 'createDate',
                customRender(value) {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
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
                pageSize: this.pagination.pageSize,
                activityId:this.$route.query.activityId
            }
            let input = this.queryForm.getFieldsValue()
            let value = Object.assign(query, input)
            this.loading = true
            ActivityService.getHistoryList(value).then(res => {
                this.data = res.data.result.list
                this.pagination.total = res.data.result.total
                this.loading = false
            })
        }
    }
}
</script>

<style scoped>

</style>
