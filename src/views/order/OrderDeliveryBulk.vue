<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary hit-box">
            批量发货目前仅支持快递订单，暂不支持自提订单。数据格式请按照下列标准提高发货成功率：
            <br />
            1、按模板要求填写发货信息，注意运单号不要写成E+22科学计数法
            <br />
            2、查看失败原因，对其修改，成功率更高。
            <br />
            3、最大支持 10000 条记录（支持 csv、xls、xlsx，文件大小请控制在 1MB 以内）
        </div>
        <a-button @click="$router.push('/order/delivery/import')" type="primary">导入发货</a-button>
        <div class="p-box mt20">
            <a-form-model :model="queryForm" layout="inline">
                <a-form-model-item label="日期">
                    <a-range-picker v-model="queryForm.selectDate" />
                </a-form-model-item>
                <a-form-model-item label="状态">
                    <a-select style="width: 120px" v-model="queryForm.selectStatus">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="1">处理中</a-select-option>
                        <a-select-option value="2">已完成</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-button :loading="loading" @click="query" type="primary">筛选</a-button>
            </a-form-model>
        </div>
        <a-table row-key="id" :data-source="dataSource" :columns="columns" :pagination="false"
                 :loading="loading"></a-table>
        <p-footer-page :page-index="pageOption.pageIndex" :page-size="pageOption.pageSize"  @nextPageSize="onNextPageSize" @nextPage="onNextPage"
                       :page-total="pageOption.pageTotal" />
    </div>
</template>

<script>
import ImportService from '../../service/bulkImportService'
import moment from 'moment'

export default {
  name: 'OrderDeliveryBulk',
  data() {
    return {
      queryForm: {
        selectStatus: '',
        selectDate: []
      },
      pageOption: {
        pageIndex: 1,
        pageSize: 25,
        pageTotal: 0
      },
      loading: false,
      dataSource: [],
      columns: [{
        title: '记录编号',
        dataIndex: 'id',
      }, {
        title: '操作时间',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '发货单数',
        customRender(value, row) {
          return row.successCount + row.errorCount
        }
      }, {
        title: '成功单数',
        dataIndex: 'successCount',
      }, {
        title: '失败单数',
        dataIndex: 'errorCount',
      }, {
        title: '状态',
        dataIndex: 'taskStatus',
        customRender(value) {
          if (value === 1) {
            return '处理中'
          } else {
            return '已完成'
          }
        },
      }, {
        title: '操作',
        customRender: (value, row) => {
          return (<a href={row.downloadUrl} download={row.downloadUrl}>下载发货记录</a>)
        }
      }]
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    getFilterOption() {
      let option = {
        pageIndex: this.pageOption.pageIndex,
        pageSize: this.pageOption.pageSize
      }
      if(this.queryForm.selectDate.length>0){
        option.startDate = this.queryForm.selectDate[0].format('YYYY-MM-DD 23:59:59')
        option.endDate = this.queryForm.selectDate[1].format('YYYY-MM-DD 00:00:00')
      }
      return option
    },
    query() {
      this.loading = true
      ImportService.list(this.getFilterOption()).then(res => {
        this.loading = false
        this.pageOption.pageTotal = res.data.result.total
        this.dataSource = res.data.result.list
      })
    },
    onNextPage(index) {
      this.pageOption.pageIndex = index
      this.query()
    },
    onNextPageSize(index,size) {
      this.pageOption.pageIndex = 1
      this.pageOption.pageSize = size
      this.query()
    }
  }
}
</script>

<style scoped>
    .hit-box {
        padding: 20px;
        border-radius: 0 !important;
        font-size: 14px;
    }
</style>
