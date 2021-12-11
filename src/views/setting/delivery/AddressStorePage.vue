<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-button @click="onOpenAdd" type="primary">添加地址</a-button>
            </div>
            <div class="p-box p-box-bg-white">
                <a-table row-key="id" :pagination="false" :loading="false" :data-source="dataSource"
                         :columns="columns"></a-table>
            </div>
        </div>
        <p-footer-page :page-total="pageOption.pageTotal" :page-index="pageOption.pageIndex"
                       :page-size="pageOption.pageSize"
                       @nextPage="onNextPage" @nexrPageSize="onNextPageSize"/>
        <a-modal :visible="dialogModel.isShow" :confirm-loading="loading" @ok="onDialogConfirm"
                 @cancel="onDialogCancel" :title="dialogModel.dialogName">
            <a-form-model ref="dialog" :model="dialogModel" :label-col="{span:5}" :wrapper-col="{span:15}"
                          :rules="dialogModel.rules">
                <a-form-model-item required label="联系人" prop="name">
                    <a-input v-model="dialogModel.name" placeholder="请填写联系人"/>
                </a-form-model-item>
                <a-form-model-item required label="联系方式" prop="phone">
                    <a-input v-model="dialogModel.phone" placeholder="请填写联系方式"/>
                </a-form-model-item>
                <a-form-model-item required label="地区" prop="district">
                    <p-district-select placeholder="请选择省 / 市 / 区" v-model="dialogModel.district"/>
                </a-form-model-item>
                <a-form-model-item required label="详细地址" prop="detail">
                    <a-input v-model="dialogModel.detail" placeholder="请填写详细地址"/>
                </a-form-model-item>
                <a-form-model-item required label="地址类型" prop="labels">
                    <a-checkbox-group v-model="dialogModel.labels">
                        <a-checkbox value="收货地址">收货地址</a-checkbox>
                        <a-checkbox value="退货地址">退货地址</a-checkbox>
                    </a-checkbox-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import region from '../../../common/area'
import AddressStoreServiceAPI from '../../../service/address.store.api'
import constant from "../../../common/constant";

export default {
    name: "AddressStorePage",
    data() {
        return {
            dialogModel: {
                dialogName: '添加地址',
                isShow: false,
                loading: false,
                isUpdate: false,
                phone: null,
                name: '',
                detail: '',
                labels: [],
                district: [],
                rules: {
                    name: [{required: true, message: '联系人必须填写'}],
                    phone: [{required: true, message: '联系方式必须填写'}],
                    detail: [{required: true, message: '详细地址必须填写'}],
                    labels: [{required: true, message: '地址类型必须填写'}],
                    district: [{required: true, message: '省市区必须填写'}],
                }
            },
            columns: [{
                title: '联系人',
                dataIndex: 'name',
            }, {
                title: '联系方式',
                dataIndex: 'phone',
            }, {
                title: '地址',
                dataIndex: 'detail',
                customRender(value, row) {
                    let province = region.province_list[parseInt(row.districtCode.toString().substring(0, 2) + '0000')]
                    let city = region.city_list[parseInt(row.districtCode.toString().substring(0, 4) + '00')]
                    let district = region.county_list[row.districtCode]
                    return province + city + district + value
                }
            }, {
                title: '地址类型',
                dataIndex: 'labels'
            }, {
                title: '编辑',
                customRender: (value, row) => {
                    return (
                        <div>
                            <a onClick={() => {
                                this.onOpenUpdate(row)
                            }}>编辑</a>
                            <a-popconfirm title="确认要删除地址？" class="ml5" onConfirm={() => this.onDelete(row)}>
                                <a>删除</a>
                            </a-popconfirm>

                        </div>
                    )
                }
            }],
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 0
            },
            dataSource: [],
            loading: false
        }
    },
    created() {
        this.getPageDate()
    },
    methods: {
        getPageDate() {
            this.loading = true
            AddressStoreServiceAPI.list({
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize,
            }).then(res => {
                this.loading = false
                this.pageOption.pageTotal = res.data.result.total
                this.dataSource = res.data.result.list
                console.log(this.dataSource)
            })
        },
        onNextPage(pageIndex) {
            this.pageOption.pageIndex = pageIndex
            this.getPageDate()
        },
        onNextPageSize(pageIndex, pageSize) {
            this.pageOption.pageIndex = pageIndex
            this.pageOption.pageSize = pageSize
            this.getPageDate()
        },
        onOpenAdd() {
            this.dialogModel.isShow = true
            this.dialogModel.isUpdate = false
        },
        onOpenUpdate(row) {
            AddressStoreServiceAPI.get({id: row.id}).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    let model = res.data.result
                    this.dialogModel.id = model.id
                    this.dialogModel.name = model.name
                    this.dialogModel.phone = model.phone
                    this.dialogModel.district = [
                        model.districtCode.toString().substring(0, 2) + '0000',
                        model.districtCode.toString().substring(0, 4) + '00',
                        model.districtCode.toString()]
                    this.dialogModel.detail = model.detail
                    this.dialogModel.labels = model.labels.split(',')
                    this.dialogModel.isShow = true
                    this.dialogModel.isUpdate = true
                    console.log(this.dialogModel.district)
                }
            })
        },
        onDialogCancel() {
            this.dialogModel.isShow = false
        },
        onDialogConfirm() {
            let model = {
                id: this.dialogModel.id,
                name: this.dialogModel.name,
                phone: this.dialogModel.phone,
                districtCode: this.dialogModel.district[2],
                detail: this.dialogModel.detail,
                labels: this.dialogModel.labels.join(',')
            }
            console.log(model)
            this.$refs.dialog.validate(vaild => {
                if (vaild === false) return
                this.dialogModel.loading = true
                if (this.dialogModel.isUpdate === false) {
                    AddressStoreServiceAPI.add(model).then(res => {
                        this.dialogModel.loading = false
                        if (res.data.code === constant.serviceCode.success) {
                            this.dialogModel.isShow = false
                            this.$message.success('添加成功')
                            this.getPageDate()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    AddressStoreServiceAPI.update(model).then(res => {
                        this.dialogModel.loading = false
                        if (res.data.code === constant.serviceCode.success) {
                            this.dialogModel.isShow = false
                            this.$message.success('更新成功')
                            this.getPageDate()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        onDelete(row) {
            AddressStoreServiceAPI.del({id: row.id}).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('删除成功')
                    this.getPageDate()
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
