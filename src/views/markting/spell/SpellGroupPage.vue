<template>
    <div class="p-container">
        <div style="margin-bottom: 10px;">
            <span class="h4">拼团</span>
        </div>
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <div style="margin-left: 10px">
                        <a-button @click="()=>{$router.push('/marketing/spell/page/add').then()}"
                                  class="font-size-12 p-input-right">新建活动
                        </a-button>
                        <a-select @change="getList" class="font-size-12 p-input-right" style="width: 120px"
                                  v-model="status">
                            <a-select-option class="font-size-12" value="">全部状态</a-select-option>
                            <a-select-option class="font-size-12" value="0">未开始</a-select-option>
                            <a-select-option class="font-size-12" value="1">进行中</a-select-option>
                            <a-select-option class="font-size-12" value="-1">已结束</a-select-option>
                        </a-select>
                        <label style="margin-right: 5px" class="font-size-12">活动时间</label>
                        <a-range-picker v-model="activityDate" @change="getList"></a-range-picker>
                    </div>
                    <div>
                        <a-input-search v-model="name" @search="getList" placeholder="请输入活动名称">
                            <a-button class="font-size-12" slot="enterButton">
                                搜索
                            </a-button>
                        </a-input-search>
                    </div>
                </a-row>

            </div>
            <div v-for="item in list" :key="item.id" class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <a-row type="flex">
                        <div class="spell-img">
                            <span></span>

                            <div v-if="item.status === 0" class="spell-status spell-status-not-run font-size-12">
                                未开始
                            </div>
                            <div v-else-if="item.status === 1" class="spell-status spell-status-run font-size-12">
                                进行中
                            </div>
                            <div v-else class="spell-status spell-status-over font-size-12">
                                已结束
                            </div>
                        </div>
                        <div>
                            <div style="margin-bottom: 5px;font-weight: 700" class="font-size-12">{{item.name}}</div>
                            <div style="margin-bottom: 5px" class="font-size-12">
                                <span>活动时间：{{item.startDate}} - {{item.endDate}}</span>
                                <a-popconfirm title="确定开始活动？开始后，活动开始时间为当前时间" @confirm="onOpen(item.id)"
                                              v-if="item.status ===0"
                                              style="padding-left: 5px">
                                    <a>立即开始</a>
                                </a-popconfirm>
                                <a-popconfirm title="结束进行中的活动会影响会员正常购买，建议您提前告知或说明，确定要结束活动吗？"
                                              @confirm="onClose(item.id)" v-if="item.status ===1"
                                              style="padding-left: 5px">
                                    <a>立即结束</a>
                                </a-popconfirm>
                            </div>
                            <div style="margin-bottom: 5px" class="font-size-12">活动类型：抽奖团</div>
                            <div>
                                <a-button
                                        @click="()=> $router.push({path:'/marketing/spell/page/update',query:{id:item.id}}).then()"
                                        class="font-size-12 p-input-right">编辑活动
                                </a-button>
                                <a-button
                                        @click="()=> $router.push({path:'/marketing/spell/product/list',query:{id:item.id}}).then()"
                                        class="font-size-12 p-input-right">管理商品
                                </a-button>
                                <a-button @click="$router.push({path:'/marketing/spell/data'})" class="font-size-12 p-input-right">数据</a-button>
                                <a-button @click="()=>{$router.push({path:'/marketing/spell/user/page',query:{id:item.id}}).then()}" class="font-size-12 p-input-right">参与记录</a-button>
                            </div>
                        </div>
                    </a-row>
                    <a-row type="flex" justify="space-between"
                           style="border-left: 1px solid #DDDCE2;padding-left: 20px">
                        <a-row type="flex" style="height: 100px;flex-direction: column;width: 200px"
                               justify="space-between">
                            <a-row type="flex" style="width: 100%;text-align: end" class="font-size-12">
                                参与数量: {{item.onlineCount}}
                            </a-row>
                            <a-row type="flex" style="width: 100%;text-align: end" class="font-size-12">
                                中奖数量: {{item.winCount}}
                            </a-row>
                            <a-row type="flex" style="width: 100%;text-align: end" class="font-size-12">
                                未中数量: {{item.lostCount}}
                            </a-row>
                        </a-row>
                        <a-row type="flex" align="middle">
                            <a-icon type="right"/>
                        </a-row>
                    </a-row>
                </a-row>
            </div>
        </div>
        <div class="p-footer">
            <a-row style="height: 100%" type="flex" justify="center" align="middle">
                <a-pagination show-quick-jumper show-size-changer
                              v-model="pageOption.pageIndex"
                              :default-current="pageOption.pageIndex"
                              :page-size="pageOption.pageSize"
                              :total="pageOption.pageTotal"
                              @chang="onNextPage()"
                              :page-size-option="pageOption.pageSizeOption"/>
            </a-row>
        </div>
    </div>
</template>

<script>
import SpellActivityService from '../../../service/spell.activity.service'
import moment from 'moment'

export default {
    name: "SpellGroupPage",
    data() {
        return {
            list: [],
            pageOption: {
                pageIndex: 1,
                pageSize: 25,
                pageSizeOption: [25, 50, 100],
                pageTotal: 1
            },
            name: '',
            status: '',
            activityDate: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            let filter = {
                pageIndex: this.pageOption.pageIndex,
                pageSize: this.pageOption.pageSize
            }
            let current = moment(new Date()).format('YYYY-MM-DD HH:mm')
            if (this.status === '0') {
                filter.notStart = current
            }
            if (this.status === '1') {
                filter.start1 = current
                filter.start2 = current
            }
            if (this.status === '-1') {
                filter.end = current
            }
            if (this.name.length > 0) {
                filter.name = this.name
            }
            if (this.activityDate.length >= 2) {
                filter.startDate = moment(this.activityDate[0]).format('YYYY-MM-DD')
                filter.endDate = moment(this.activityDate[1]).format('YYYY-MM-DD')
            }
            SpellActivityService.list(filter).then(res => {
                res.data.result.list.forEach(x => {
                    let start = moment(x.startDate)
                    let end = moment(x.endDate)
                    let current = moment(new Date())
                    if (current.isBefore(start)) {
                        x.status = 0
                    } else if (current.isAfter(start) && current.isBefore(end)) {
                        x.status = 1
                    } else if (current.isAfter(end)) {
                        x.status = -1
                    }
                    x.startDate = start.format('YYYY-MM-DD HH:mm')
                    x.endDate = end.format('YYYY-MM-DD HH:mm')
                })
                this.list = res.data.result.list
                this.pageOption.pageTotal = res.data.result.total
            })
        },
        onClose(id) {
            SpellActivityService.close({id: id}).then(res => {
                this.getList()
            })
        },
        onOpen(id) {
            SpellActivityService.open({id: id}).then(res => {
                this.getList()
            })
        },
        onNextPage(current) {
            this.pageOption.pageIndex = current
            this.getList()
        }
    }
}
</script>

<style scoped>
    @import "../../../assets/css/page-box.css";

    .spell-img {
        object-fit: cover;
        width: 100px;
        height: 100px;
        margin-right: 25px;
        position: relative;
    }

    .spell-img span {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url("https://image-c.weimobwmc.com/saas-wxbiz/530aaec044484d388cf739f99ec2f56a.png") center center / cover no-repeat;
    }

    .spell-status {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 5px 2px 5px;
        color: white;
    }

    .spell-status-run {
        background-color: #58d44d;
    }

    .spell-status-not-run {
        background-color: red;
    }

    .spell-status-over {
        background-color: #B2AEBC;
    }
</style>
