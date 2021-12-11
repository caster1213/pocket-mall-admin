<template>
    <div class="p-container">
        <div style="margin-bottom: 60px;" class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row justify="space-between" type="flex">
                    <a-col>
                        <span class="font-size-12">拼团状态</span>
                        <a-select v-model="filter.status" @change="execFilter" default-value="1"
                                  class="p-input-left p-input-right font-size-12" style="width: 120px">
                            <a-select-option class="font-size-12" value="">全部状态</a-select-option>
                            <a-select-option class="font-size-12" value="1">拼团中</a-select-option>
                            <a-select-option class="font-size-12" value="2">已成团</a-select-option>
                            <a-select-option class="font-size-12" value="-1">拼团失败</a-select-option>
                        </a-select>
                        <span class="font-size-12">成交状态</span>
                        <a-select v-model="filter.hit"  @change="execFilter"  default-value="1" class="p-input-left font-size-12"
                                  style="width: 120px">
                            <a-select-option class="font-size-12" value="">全部状态</a-select-option>
                            <a-select-option class="font-size-12" value="1">已成交</a-select-option>
                            <a-select-option class="font-size-12" value="0">未成交</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col>
                        <a-input-search style="width: 220px" @search="execFilter" v-model="filter.name" placeholder="请输入用户名称">
                            <a-button class="font-size-12" slot="enterButton">
                                搜索
                            </a-button>
                        </a-input-search>
                    </a-col>
                </a-row>
            </div>
            <a-table row-key="id" :loading="loading" :pagination="false" :data-source="dataSource" :columns="columns"></a-table>
        </div>
        <p-footer-page :page-index="pageOption.pageIndex"
                       :page-size="pageOption.pageSize"
                       :page-total="pageOption.pageTotal"
                       @nextPage="onNextPage" @nextPageSize="onNextPageSize">
        </p-footer-page>
    </div>
</template>

<script>
import SpellActivityService from '../../../service/spell.activity.service'
import constant from "../../../common/constant";
import moment from 'moment'

export default {
    name: "SpellUserHistoryPage",
    data() {
        return {
            filter: {
                name: '',
                status: '',
                hit: '',
                id: -1
            },
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 0
            },
            columns: [{
                dataIndex: 'nickname',
                title: '用户'
            }, {
                dataIndex: 'orderNumber',
                title: '订单号'
            }, {
                dataIndex: 'hit',
                title: '是否中奖',
                customRender: (value, row) => {
                    if (row.status === 1) {
                        return '-'
                    }
                    return value === true ? '已中奖' : '未中奖'
                }
            }, {
                dataIndex: 'spellDate',
                title: '成团日期',
                customRender: (value, row) => {
                    if (row.status === 1) {
                        return '-'
                    }
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                dataIndex: 'status',
                title: '排队状态',
                customRender: (value) => {
                    switch (value) {
                        case 1:
                            return '排队中'
                        case 2:
                            return '已成团'
                        default:
                            return '已取消'
                    }
                }
            }, {
                dataIndex: 'createDate',
                title: '参与日期',
                customRender: (value) => {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            }],
            dataSource: [],
            loading:false
        }
    },
    created() {
        this.filter.id = this.$route.query.id
        this.getDateSource()
    },
    methods: {
        execFilter() {
            this.pageOption.pageIndex = 1
            this.getDateSource()
        },
        getDateSource() {
            this.loading = true
            let filter = {
                activityId: this.filter.id,
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize
            }
            if (this.filter.status.length>0) {
                filter.status = this.filter.status
            }
            if (this.filter.hit.length>0) {
                filter.hit = this.filter.hit === '1'
            }
            if (this.filter.name.length > 0) {
                filter.nickname = this.filter.name
            }
            SpellActivityService.getUser(filter).then(res => {
                this.loading = false
                if (res.data.code === constant.serviceCode.success) {
                    this.dataSource = res.data.result.list
                    this.pageOption.pageTotal = res.data.result.total
                }
            })
        },
        onNextPage(index) {
            this.pageOption.pageIndex = index
            this.getDateSource()
        },
        onNextPageSize(index,size) {
            this.pageOption.pageIndex = 1
            this.pageOption.pageSize = size
            this.getDateSource()
        }
    }
}
</script>

<style scoped>
    .p-box /deep/ .ant-table-body tbody tr td {
        background-color: #fff;
        font-size: 12px !important;
    }
</style>
