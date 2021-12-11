<template>
    <div>
        <a-button @click="()=> createVisibleModal = true">添加</a-button>
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
                    <template slot="image" slot-scope="value,row">
                        <img width="64" height="64" :src="row.image"/>
                    </template>
                    <template slot="onlineToggle" slot-scope="value,row">
                        <a-switch :loading="onlineToggleLoading" @change="onChangeOnlineToggle(row)"
                                  v-model="row.onlineStatus ===1"
                                  checked-children="上线" un-checked-children="下线"/>
                    </template>
                    <template slot="action" slot-scope="value,row">
                        <a @click="setModelUpdate(row)">更新</a>
                        <a-popconfirm @confirm="del(row)" title="确认删除？">
                            <a style="margin-left: 5px">删除</a>
                        </a-popconfirm>
                    </template>
                </a-table>
            </div>
        </div>
        <a-modal
                title="添加"
                v-model="createVisibleModal"
                okText="确认"
                :confirmLoading="loading"
                @ok="addHandler"
                @cancel="()=> createVisibleModal = false"
        >
            <a-form :form="createForm">
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="名称">
                    <a-input v-decorator="['name',{rules:[{required:true,message:'必须填写名称'}]}]"></a-input>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="图片">
                    <a-upload listType="picture-card" :action="uploadUrl"
                              v-decorator="['image',{valuePropName: 'fileList',getValueFromEvent: imageOnChange,},]">
                        <div v-if="imageList.length < 1">
                            <a-icon type="plus"/>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="是否上线">
                    <a-switch v-decorator="['onlineStatus',{valuePropName:'checked'}]" checked-children="上线"
                              un-checked-children="下线"/>
                </a-form-item>
                <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                             label="序号">
                    <a-input v-decorator="['sortIndex']"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import CommonApi from '../../service/common.service'

export default {
    name: "Banner",
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
            current: null,
            uploadUrl: process.env.VUE_APP_UPLOAD_BANNER_URL,
            imageList: [],
            columns: [{
                title: '名称',
                dataIndex: 'name'
            }, {
                title: '图片',
                scopedSlots: {customRender: 'image'}
            }, {
                title: '序号',
                dataIndex: 'soreIndex'
            }, {
                title: '上线状态',
                dataIndex: 'onlineStatus',
                scopedSlots: {customRender: 'onlineToggle'}
            }, {
                title: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'}
            }],
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
            },
            loading: false,
            onlineToggleLoading: false,
            updateVisibleModal: false,
            createVisibleModal: false,
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
            let query = {
                pageIndex: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            CommonApi.getBannerList(query).then(res => {
                this.data = res.data.result.list
                this.loading = false
            })
        },
        onChange(event) {
            this.pagination.current = event.current
            this.pagination.pageSize = event.pageSize
            this.load()
        },
        addHandler() {
            this.createForm.validateFields((error, values) => {
                if (error !== null) return
                this.loading = true
                let request = {
                    image: values.image[0].response.result.url,
                    onlineStatus: values.onlineStatus === true ? 1 : 2,
                    name: values.name,
                    soreIndex: values.sortIndex
                }
                console.log(request)
                if (this.current === null) {
                    CommonApi.addBanner(request).then(res => {
                        if (res.data.code === 0) {
                            this.createVisibleModal = false
                            this.load()
                        }
                    })
                } else {
                    request.id = this.current.id
                    CommonApi.updateBanner(request).then(res => {
                        if (res.data.code === 0) {
                            this.createVisibleModal = false
                            this.load()
                            this.current = null
                        }
                    })
                }

            })
        },
        imageOnChange(e) {
            this.imageList = e.fileList
            return e && e.fileList;
        },
        del(e) {
            CommonApi.deleteBanner({id: e.id}).then(res => {
                this.load()
                if (res.data.code !== 0) {
                    this.$message.error(res.data.msg)
                } else {
                    this.$message.success('删除成功')
                }
            })
        },
        onChangeOnlineToggle(e) {
            if (e.onlineStatus === 1) e.onlineStatus = 2
            else e.onlineStatus = 1
            this.onlineToggleLoading = true
            CommonApi.updateBanner(e).then(() => {
                this.onlineToggleLoading = false
            })
        },
        setModelUpdate(e) {
            this.current = e
            this.createVisibleModal = true
            this.imageList.push({
                uid: '-1',
                name: e.image,
                status: 'done',
                url: e.image,
                thumbUrl: e.image,
                response: {
                    result: {
                        url: e.image
                    }
                }
            })
            this.createForm.getFieldDecorator("name", {initialValue: e.name})
            this.createForm.getFieldDecorator("sortIndex", {initialValue: e.soreIndex})
            this.createForm.getFieldDecorator("onlineStatus", {initialValue: e.onlineStatus === 1})
            this.createForm.getFieldDecorator("image", {
                initialValue: [{
                    uid: '-1',
                    name: e.image,
                    status: 'done',
                    url: e.image,
                    thumbUrl: e.image,
                    response: {
                        result: {
                            url: e.image
                        }
                    }
                }]
            })
        }
    }
}
</script>

<style scoped>

</style>
