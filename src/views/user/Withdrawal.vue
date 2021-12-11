<template>
  <div class="components-form-demo-advanced-search">
    <a-form
        class="select-form"
        layout="inline"
        :form="queryForm"
        @submit="query"
    >
      <a-form-item label="提现搜索">
        <a-select style="width: 180px" allowClear v-decorator="['searchKey']">
          <a-select-option value="nickname">姓名</a-select-option>
          <a-select-option value="phone">电话</a-select-option>
          <a-select-option value="bankCode">银行卡号(支付宝账号)</a-select-option>
          <a-select-option value="bankName">银行名称(支付宝姓名)</a-select-option>
        </a-select>
        <a-input v-decorator="['searchValue']" class="p-input-left-5" style="width: 180px"/>
      </a-form-item>
      <a-row>
        <a-form-item label="处理状态">
          <a-select style="width: 160px" allowClear v-decorator="['state']">
            <a-select-option value="1">待审核</a-select-option>
            <a-select-option value="2">已审核</a-select-option>
            <a-select-option value="3">已打款</a-select-option>
            <a-select-option value="-1">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="申请类型">
          <a-select style="width: 160px" allowClear v-decorator="['type']">
            <a-select-option value="1">银行卡</a-select-option>
            <a-select-option value="2">支付宝</a-select-option>
            <a-select-option value="3">微信</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="申请时间">
          <a-range-picker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              v-decorator="['applyDate']"
          />
        </a-form-item>
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
    <a-button :lading="exportLoading" @click="exportData">导出</a-button>
    <div class="search-result-list">
      <a-table
          rowKey="id"
          :columns="columns"
          :loading="loading"
          :dataSource="data"
          :pagination="pagination"
          @change="onChange"
      >
        <template slot="action" slot-scope="value,row">
          <div v-if="row.state === 1">
            <a-popconfirm title="确认通过该笔提现申请？" @confirm="approve(row)">
              <a-button type="link" class="text-action-btn">审核</a-button>
            </a-popconfirm>
            <a-button @click="refuse(row)" type="link" class="text-action-btn">驳回</a-button>
          </div>
          <a-popconfirm v-if="row.state=== 2" title="确认完成该笔提现？" @confirm="completed(row)">
            <a-button type="link" class="text-action-btn">打款</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AccountService from '../../service/account.service'
import ExportService from '../../service/export.service'
import common from '../../common/common';

export default {
  name: 'Withdrawal',
  data() {
    return {
      queryForm: this.$form.createForm(this),
      loading: false,
      exportLoading: false,
      refuseMessage: '',
      refuseMessageSelect: '',
      columns: [{
        title: '姓名',
        dataIndex: 'nickname'
      }, {
        title: '手机',
        dataIndex: 'phone'
      }, {
        title: '申请金额',
        dataIndex: 'amount'
      }, {
        title: '手续费',
        dataIndex: 'fee'
      }, {
        title: '类型',
        dataIndex: 'type',
        customRender: (value) => {
          if (value === 1) {
            return <a-tag color="red">银行卡</a-tag>
          } else {
            return <a-tag color="blue">支付宝</a-tag>
          }
        }
      }, {
        title: '银行卡',
        dataIndex: 'bankCode'
      }, {
        title: '银行名称',
        dataIndex: 'bankName'
      }, {
        title: '持卡人',
        dataIndex: 'cardholder'
      }, {
        title: '处理状态',
        dataIndex: 'state',
        customRender(value) {
          switch (value) {
            case 1:
              return '待处理'
            case 2:
              return '已通过'
            case 3:
              return '已打款'
            case -1:
              return '已驳回'
          }
        }
      }, {
        title: '申请日期',
        dataIndex: 'applyDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
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
  computed: {
    roleName() {
      return this.$store.state.role
    }
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
    exportData() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()
      let value = Object.assign(query, input)
      if (input.applyDate !== undefined) {
        value.startDate = input.applyDate[0].format('YYYY-MM-DD HH:mm:ss')
        value.endDate = input.applyDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
      if (input.searchKey !== undefined && input.searchValue !== undefined) {
        value[input.searchKey] = input.searchValue
      }
      this.exportLoading = true
      ExportService.exportWithdraw(query).then(res => {
        this.exportLoading = false
        if (common.isSuccess(res)) {
          this.$message.success('导出成功！请前往数据-下载中心进行查看')
        }
      })
    },
    load() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()

      let value = Object.assign(query, input)
      if (input.applyDate !== undefined) {
        value.startDate = input.applyDate[0].format('YYYY-MM-DD HH:mm:ss')
        value.endDate = input.applyDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
      if (input.searchKey !== undefined && input.searchValue !== undefined) {
        value[input.searchKey] = input.searchValue
      }
      this.loading = true
      AccountService.withdrawalList(value).then(res => {
        this.data = res.data.result.list
        this.pagination.total = res.data.result.total
        this.loading = false
      })
    },
    approve(obj) {
      AccountService.withdrawApprove({id: obj.id})
          .then(res => {
            if (res.data.code === 0) {
              obj.state = 2
              this.$message.success('操作成功！')
            } else {
              this.$message.error(res.data.msg)
            }
          })
    },
    completed(obj) {
      AccountService.withdrawCompleted({id: obj.id})
          .then(res => {
            if (res.data.code === 0) {
              obj.state = 2
              this.$message.success('操作成功！')
            } else {
              this.$message.error(res.data.msg)
            }
          })
    },
    refuse(obj) {
      let _this = this
      this.$confirm({
        title: '驳回确认',
        content: () => {
          return (<div>
            <a-row class="mb20" type="flex" align="middle">
              <a-col span={5} style="font-size:13px;text-align:right;">驳回原因:</a-col>
              <a-col class="ml20">
                <a-select v-model={_this.refuseMessageSelect} allowClear={true} style="width:150px">
                  <a-select-option value="银行卡号填写错误">银行卡号填写错误</a-select-option>
                  <a-select-option value="银行卡信息不匹配">银行卡信息不匹配</a-select-option>
                  <a-select-option value="支付宝账号填写错误">支付宝账号填写错误</a-select-option>
                  <a-select-option value="支付宝账号不存在">支付宝账号不存在</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row type="flex" align="middle">
              <a-col span={5} style="font-size:13px;text-align:right;">其他:</a-col>
              <a-col class="ml20">
                <a-textarea v-model={_this.refuseMessage}></a-textarea>
              </a-col>
            </a-row>
          </div>)
        },
        onOk() {
          let reason = ''
          if (_this.refuseMessageSelect.length > 0) {
            reason = _this.refuseMessageSelect
          }
          if (_this.refuseMessage.length > 0) {
            reason = _this.refuseMessage
          }
          AccountService.withdrawRefuse({id: obj.id, reason: reason})
              .then(res => {
                if (res.data.code === 0) {
                  obj.state = -1
                  _this.$message.success('操作成功！')
                } else {
                  _this.$message.error(res.data.msg)
                }
              })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
