<template>
    <div>
        <div>
            <div class="p-box p-box-bg-gary" style="height: 70px">
                <span style="text-align: left;">
                    <span class="h4" style="line-height: 50px;margin-left: 15px">到店自提</span>
                    <span style="line-height: 50px; margin-left: 10px">
                        <a-switch :loading="loadOption.isOpenLoading" v-model="form.isOpen"
                                  color="green"></a-switch>
                    </span>
                    <span style="line-height: 50px;margin-left: 10px;color: #9797A1;font-size: 12px">
                        {{openText}}
                    </span>
                </span>
            </div>
            <div class="p-box p-box-bg-gary over">
                <a-tabs size="small" :tabBarStyle="{border:'0px'}" v-model="tabIndex" @change="()=>{}">
                    <a-tab-pane :key="tabName.list" tab="自提点管理">
                        <div class="p-box p-box-bg-white">
                            <div style="padding: 10px 0 5px 20px">
                                <a-row>
                                    <a-button @click="()=>{$router.push('/setting/delivery/custom/add').then()}"
                                              class="p-input-right font-size-12">新增自提点
                                    </a-button>
                                    <!--<a-button class="p-input-right font-size-12">批量导入自提点</a-button>
                                    <a-button class="p-input-right font-size-12">批量导出自提点</a-button>-->
                                </a-row>
                                <a-row type="flex" justify="space-between" style="margin-top: 20px">
                                    <a-col>
                                        <a-select v-model="filter.provinceCode" class="p-input-right font-size-12"
                                                  style="width: 110px"
                                                  @change="()=>{
                                                      this.pageOption.pageIndex =1
                                                      this.getDataSource()
                                                  }"
                                                  default-value="-1">
                                            <a-select-option value="-1">门店所在省</a-select-option>
                                            <a-select-option v-for="(item,index) in getProvinceList" :key="item.key">
                                                {{item.value}}
                                            </a-select-option>
                                        </a-select>
                                        <a-select v-model="filter.cityCode" class="p-input-right font-size-12"
                                                  style="width: 110px"
                                                  @change="()=>{
                                                      this.pageOption.pageIndex =1
                                                      this.getDataSource()
                                                  }"
                                                  default-value="-1">
                                            <a-select-option value="-1">门店所在市</a-select-option>
                                            <a-select-option v-for="(item,index) in getCityList" :key="item.key">
                                                {{item.value}}
                                            </a-select-option>
                                        </a-select>
                                        <a-select v-model="filter.districtCode" class="p-input-right font-size-12"
                                                  style="width: 120px"
                                                  @change="()=>{
                                                      this.pageOption.pageIndex =1
                                                      this.getDataSource()
                                                  }"
                                                  default-value="-1">
                                            <a-select-option value="-1">门店所在区县</a-select-option>
                                            <a-select-option v-for="(item,index) in getDistrictList" :key="item.key">
                                                {{item.value}}
                                            </a-select-option>
                                        </a-select>
                                        <a-select v-model="filter.status" class="p-input-right font-size-12"
                                                  style="width: 110px"
                                                  @change="()=>{
                                                      this.pageOption.pageIndex =1
                                                      this.getDataSource()
                                                  }"
                                                  default-value="-1">
                                            <a-select-option value="-1">所有状态</a-select-option>
                                            <a-select-option value="1">启用</a-select-option>
                                            <a-select-option value="0">未启用</a-select-option>
                                        </a-select>
                                    </a-col>
                                    <a-col>
                                        <a-input-search @search="()=>{
                                            this.pageOption.pageIndex =1
                                            this.getDataSource()
                                        }" v-model="filter.name" placeholder="自提点名称">
                                            <a-button class="font-size-12" slot="enterButton">
                                                搜索
                                            </a-button>
                                        </a-input-search>
                                    </a-col>
                                </a-row>
                            </div>
                        </div>
                        <a-table class="custom-page" :loading="loadOption.pageLoading" :pagination="false"
                                 :columns="columns" rowKey="id"
                                 :data-source="dataSource"></a-table>
                    </a-tab-pane>
                    <a-tab-pane :key="tabName.config" tab="设置">
                        <div class="p-box p-box-bg-white">
                            <a-row type="flex" justify="center">
                                <a-form-model :form="form" ref="configForm" style="width: 80%" :labelCol="{span:4}"
                                              :wrapperCol="{span:15}">
                                    <a-form-model-item label="自定义名称">
                                        <a-input v-model="form.name"></a-input>
                                    </a-form-model-item>
                                    <a-form-model-item label="设置为默认配送方式">
                                        <a-switch class="font-size-12" v-model="form.isDefault"></a-switch>
                                        <span class="font-size-12 p-input-left p-help-text">已开启</span>
                                        <span class="font-size-12 p-input-left p-help-text">买家下单时，默认[到店自提]作为默认配送方式</span>
                                    </a-form-model-item>
                                </a-form-model>
                            </a-row>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <p-footer v-if="tabIndex === '2'">
            <template #content>
                <a-button @click="onSaveConfig" :loading="loadOption.saveBtnLoading" class="font-size-12"
                          type="primary">保存
                </a-button>
            </template>
        </p-footer>
        <p-footer-page v-else
                       @nextPage="(pageIndex)=>{
                           this.pageOption.pageIndex =  pageIndex
                            this.getDataSource()}"
                       @nextPageSize="(pageIndex,pageSize)=>{
                            this.pageOption.pageIndex =1
                            this.pageOption.pageSize = pageSize
                            this.getDataSource()
                       }"
                       :page-index="pageOption.pageIndex" :page-total="pageOption.pageTotal"></p-footer-page>
    </div>
</template>

<script>
import moment from 'moment'
import selfTakeDeliveryService from "../../../service/selfTakeDeliveryService"
import constant from "../../../common/constant"
import area from '../../../common/area'

export default {
    name: "CustomPage",
    computed: {
        openText() {
            return this.form.isOpen ? '已开启' : '已关闭'
        },
        getProvinceList() {
            let list = []
            for (const key in area.province_list) {
                list.push({
                    key: key,
                    value: area.province_list[key]
                })
            }
            return list
        },
        getCityList() {
            let list = []
            if (this.filter.provinceCode.substring(0, 2) !== this.filter.cityCode.substring(0, 2)) {
                this.filter.cityCode = '-1'
            }
            if (this.filter.provinceCode === '-1') {
                return list
            }
            for (const key in area.city_list) {
                if (key.substring(0, 2) === this.filter.provinceCode.substring(0, 2)) {
                    list.push({
                        key: key,
                        value: area.city_list[key]
                    })
                }
            }
            return list
        },
        getDistrictList() {
            let list = []
            if (this.filter.cityCode.substring(0, 4) !== this.filter.districtCode.substring(0, 4)) {
                this.filter.districtCode = '-1'
            }
            if (this.filter.cityCode === '-1') {
                return list
            }
            for (const key in area.county_list) {
                if (key.substring(0, 4) === this.filter.cityCode.substring(0, 4)) {
                    list.push({
                        key: key,
                        value: area.county_list[key]
                    })
                }
            }
            return list
        }
    },
    data() {
        return {
            form: {
                name: '到店自提',
                isOpen: false,
                isDefault: false,
                isAutoReady: false,
                autoReadyOption: '1',
                autoReadyNowHour: '',
                autoReadyNowMinute: '',
                autoReadySpecifyDay: '',
                autoReadyOrderLessHour: '',
                autoReadyOrderLessMinute: '',
                autoReadyOrderLessLastDay: '',
                autoReadyOrderGreaterLastDay: '',
                isOptional: false,
                optionalStartTime: '',
                optionalEndTime: '',
                timeOptions: [],
                isExpire: false,
                expiryDay: '0',
                expiryOption: '1'
            },
            loadOption: {
                isOpenLoading: false,
                saveBtnLoading: false,
                pageLoading: false
            },
            config: {
                isOpen: false
            },
            tabIndex: '1',
            filter: {
                provinceCode: '-1',
                cityCode: '-1',
                districtCode: '-1',
                status: '-1',
                name: ''
            },
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 0
            },
            tabName: {
                list: '1',
                config: '2'
            },
            dataSource: [],
            columns: [{
                dataIndex: 'name',
                title: '自提点名称'
            }, {
                title: '自提点地址',
                customRender: (value, row) => {
                    let address = `${row.province}${row.city}${row.district}`
                    address += row.detail
                    return address
                }
            }, {
                dataIndex: 'adminPhone',
                title: '联系电话'
            }, {
                dataIndex: 'status',
                title: '状态',
                customRender: (value, row) => {
                    row.loading = false
                    return (<a-switch onChange={() => {
                        this.onChangeStatus(row)
                    }} loading={row.loading} v-model={row.status}></a-switch>)
                }
            }, {
                title: '操作',
                customRender: (value, row) => {
                    return (
                        <div>
                            <a onClick={() => {
                                this.$router.push({path: '/setting/delivery/custom/update', query: {id: row.id}})
                            }} style="margin-right:10px">编辑</a>
                            <a-popconfirm title="确认删除?" onConfirm={() => {
                                this.onDelete(row.id)
                            }}>
                                <a>删除</a>
                            </a-popconfirm>
                        </div>
                    )
                }
            }]
        }
    },
    created() {
        this.getConfig()
        this.getDataSource()
    },
    methods: {
        getConfig() {
            selfTakeDeliveryService.getConfig().then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    if (res.data.result !== null) {
                        let result = res.data.result
                        this.form.name = result.name
                        this.form.isOpen = result.isOpen
                        this.form.isAutoReady = result.isAutoReady
                        this.form.isOptional = result.isTimeOption
                        this.form.isExpire = result.isExpire
                        this.form.autoReadyOption = result.autoReadyOption.toString()
                        this.form.autoReadyNowHour = result.orderAfterHour
                        this.form.autoReadyNowMinute = result.orderAfterMinute
                        this.form.autoReadySpecifyDay = result.orderAfterDay
                        this.form.autoReadyOrderLessHour = result.orderTimeBeforeHour
                        this.form.autoReadyOrderLessMinute = result.orderTimeBeforeMinute
                        this.form.autoReadyOrderLessLastDay = result.orderTimeBeforeDay
                        this.form.autoReadyOrderGreaterLastDay = result.orderTimeAfterDay
                        this.form.expiryDay = result.expiryDay
                        this.form.expiryOption = result.expiryOption === null ? '1' : result.expiryOption.toString()
                        this.form.timeOptions = result.timeOptions.map(x => {
                            return {
                                start: moment({hour: x.startHour, minute: x.startMinute}),
                                end: moment({hour: x.endHour, minute: x.endMinute})
                            }
                        })
                    }
                }
            })
        },
        onChangeStatus(row) {
            row.loading = true
            selfTakeDeliveryService.updateStatus({id: row.id}).then(res => {
                row.loading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('更新成功')
                } else {
                    this.$message.success(`更新失败 ${res.data.msg}`)
                    row.status = !row.status
                }
            })
        },
        onSaveConfig() {
            if (this.form.isTimeOption && this.form.timeOptions.length === 0) {
                this.$message.warning('请填写自提时间')
                return
            }
            if (this.form.isAutoReady) {
                if (this.form.autoReadyOption === '1' && (this.form.autoReadyNowHour === '' || this.form.autoReadyNowMinute === '')) {
                    this.$message.warning('请填写字段')
                    return
                }
                if (this.form.autoReadyOption === '2' && this.form.autoReadySpecifyDay === '') {
                    this.$message.warning('请填写字段')
                    return
                }
                if (this.form.autoReadyOption === '3') {
                    if (this.form.autoReadyOrderLessHour === '' ||
                        this.form.autoReadyOrderLessMinute === '' ||
                        this.form.autoReadyOrderLessLastDay === '' ||
                        this.form.autoReadyOrderGreaterLastDay === '') {
                        this.$message.warning('请填写字段')
                        return
                    }
                }
            }
            if (this.form.isExpire) {
                if (this.form.expiryDay === '') {
                    this.$message.warning('请填写字段')
                    return
                }
            }
            let config = {
                name: this.form.name,
                isOpen: this.form.isOpen,
                isAutoReady: this.form.isAutoReady,
                isTimeOption: this.form.isOptional,
                isExpire: this.form.isExpire,
                autoReadyOption: this.form.autoReadyOption,
                orderAfterHour: this.form.autoReadyNowHour,
                orderAfterMinute: this.form.autoReadyNowMinute,
                orderAfterDay: this.form.autoReadySpecifyDay,
                orderTimeBeforeHour: this.form.autoReadyOrderLessHour,
                orderTimeBeforeMinute: this.form.autoReadyOrderLessMinute,
                orderTimeBeforeDay: this.form.autoReadyOrderLessLastDay,
                orderTimeAfterDay: this.form.autoReadyOrderGreaterLastDay,
                expiryDay: this.form.expiryDay,
                expiryOption: this.form.expiryOption,
                timeOptions: this.form.timeOptions.map(x => {
                    return {
                        startHour: x.start.hour(),
                        startMinute: x.start.minute(),
                        endHour: x.end.hour(),
                        endMinute: x.end.minute()
                    }
                })
            }

            this.loadOption.saveBtnLoading = true
            selfTakeDeliveryService.updateConfig(config).then(res => {
                this.loadOption.saveBtnLoading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('保存成功！')
                }
            })

        },
        onDelete(id) {
            selfTakeDeliveryService.del({id: id}).then(res => {
                if (res.data.code === constant.serviceCode.success) {
                    this.$message.success('删除成功！')
                    this.getDataSource()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getDataSource() {
            let filter = {}
            if (this.filter.provinceCode !== '-1') {
                filter.province = area.province_list[this.filter.provinceCode]
            } else {
                this.filter.cityCode = '-1'
                this.filter.districtCode = '-1'
            }
            if (this.filter.cityCode !== '-1') {
                filter.city = area.city_list[this.filter.cityCode]
            }
            if (this.filter.districtCode !== '-1') {
                filter.districtCode = this.filter.districtCode
            }
            if (this.filter.status !== '-1') {
                filter.status = this.filter.status === '1'
            }
            if (this.filter.name.length > 0) {
                filter.name = this.filter.name
            }
            filter.pageIndex = this.pageOption.pageIndex
            filter.pageSize = this.pageOption.pageSize
            this.loadOption.pageLoading = true
            selfTakeDeliveryService.getList(filter).then(res => {
                this.loadOption.pageLoading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.pageOption.pageTotal = res.data.result.total
                    this.dataSource = res.data.result.list
                }
            })
        }
    }
}
</script>

<style scoped>
    .custom-page /deep/ .ant-table-body tbody tr td {
        background-color: #fff;
        font-size: 12px !important;
    }

    .custom-page-input {
        width: 60px;
        margin-left: 5px;
        margin-right: 5px
    }
</style>
