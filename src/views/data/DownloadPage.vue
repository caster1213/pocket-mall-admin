<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="space-between">
                    <a-row type="flex" align="middle">
                        <span>创建日期</span>
                        <a-range-picker @change="onDateChange" v-model="selectDataRang" style="margin-left: 20px" />
                    </a-row>
                    <a-row>
                        <a-input-search v-model="selectName" @search="onSearch" style="min-width: 320px"
                                        placeholder="请输入报表关键字名称">
                            <a-button style="font-size: 12px" slot="enterButton">
                                查询
                            </a-button>
                        </a-input-search>
                    </a-row>
                </a-row>
            </div>
            <div class="p-box p-box-bg-white">
                <a-table row-key="id" :columns="columns" :data-source="dataSource" :pagination="false"
                         :loading="loading" />
            </div>
        </div>
        <p-footer-page @nextPageSize="onNextPage" @nextPage="onNextPage" :page-total="pageOption.pageTotal"
                       :page-size="pageOption.pageSize" :page-index="pageOption.pageIndex" />
    </div>
</template>

<script>
import ExportStatementService from '../../service/export.service'
import moment from 'moment'
import util from '../../common/common'

export default {
  name: 'DownloadPage',
  data() {
    return {
      dataSource: [],
      loading: false,
      selectDataRang: [],
      selectName: '',
      pageOption: {
        pageIndex: 1,
        pageSize: 25,
        pageTotal: 0
      },
      columns: [{
        title: '序号',
        dataIndex: 'id',
      }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '下载次数',
        dataIndex: 'downloadCount',
      }, {
        title: '状态',
        dataIndex: 'status',
        customRender: (value) => {
          if (value === 1) {
            return '正在导出'
          } else {
            return '处理完成'
          }
        }
      }, {
        title: '报表创建日期',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作',
        customRender: (v, row) => {
          if (row.status === 2) {
            return (<div>
              <a onClick={() => this.onDownload(row.downloadUrl)}>下载</a>
            </div>)
          } else {
            return ''
          }

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
      if (this.selectDataRang.length > 0) {
        option.startDate = this.selectDataRang[0].format('YYYY-MM-DD 00:00:00')
        option.endDate = this.selectDataRang[1].format('YYYY-MM-DD 23:59:59')
      }
      if (this.selectName.length > 0) {
        option.name = this.selectName
      }
      return option
    },
    query() {
      this.loading = true
      let option = this.getFilterOption()
      ExportStatementService.list(option).then(res => {
        this.loading = false
        this.dataSource = res.data.result.list
        this.pageOption.pageTotal = res.data.result.total
      })
    },
    onDownload(url) {
      util.download(url)
    },
    onSearch() {
      this.query()
    },
    onDateChange() {
      this.query()
    },
    onNextPage(pageIndex, pageSize) {
      this.pageOption.pageIndex = pageIndex
      this.pageOption.pageSize = pageSize
      this.query()
    }
  }
}
</script>

<style scoped>

</style>
