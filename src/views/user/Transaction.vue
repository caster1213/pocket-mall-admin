<template>
    <div class="components-form-demo-advanced-search">
        <a-form class="select-form"
                :form="queryForm"
                @submit="query">
            <a-row :gutter="24">
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="姓名">
                        <a-input v-decorator="['nickname']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="电话">
                        <a-input v-decorator="['phone']"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}"
                       :md="{span:8}">
                    <a-form-item label="收益类型">
                        <a-select v-decorator="['transactionType']">
                            <a-select-option value="3">复购将</a-select-option>
                            <a-select-option value="4">推荐奖</a-select-option>
                            <a-select-option value="5">充值</a-select-option>
                            <a-select-option value="6">退款</a-select-option>
                            <a-select-option value="7">提现</a-select-option>
                            <a-select-option value="10">消费</a-select-option>
                            <a-select-option value="11">月奖</a-select-option>
                            <a-select-option value="12">未拼中</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :xs="{ span:16}"
                       :md="{span:9}">
                    <a-form-item label="创建日期">
                        <a-range-picker format="YYYY-MM-DD HH:mm:ss"
                                        showTime
                                        v-decorator="['createDate']" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24"
                       :style="{ textAlign: 'right' }">
                    <a-button :loading="loading"
                              type="primary"
                              html-type="submit">
                        查询
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }"
                              @click="reset">
                        重置
                    </a-button>
                </a-col>
            </a-row>
        </a-form>
        <div class="search-result-list">
            <a-table rowKey="id"
                     :columns="columns"
                     :loading="loading"
                     :dataSource="data"
                     :pagination="pagination"
                     @change="onChange">
            </a-table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import AccountService from '../../service/account.service'

export default {
  name: 'Transaction',
  data() {
    return {
      queryForm: this.$form.createForm(this),
      loading: false,
      columns: [{
        title: '姓名',
        dataIndex: 'nickname'
      }, {
        title: '金额',
        dataIndex: 'amount'
      }, {
        title: '来源(订单号)',
        dataIndex: 'source'
      }, {
        title: '支出/收入',
        dataIndex: 'incomeOrExpense',
        customRender(value) {
          if (value === 1) {
            return '收入'
          } else {
            return '支出'
          }
        },
      }, {
        title: '收益类型',
        dataIndex: 'transactionType',
        customRender(value) {
          switch (value) {
            case 3:
              return '复购将'
            case 4:
              return '推荐奖'
            case 5:
              return '充值'
            case 6:
              return '退款'
            case 7:
              return '提现'
            case 10:
              return '消费'
            case 12:
              return '未拼中'
          }
        }
      }, {
        title: '备注',
        dataIndex: 'remark',
        customRender(value) {
          if (value.length === 0) return '-'
          else return value
        }
      }, {
        title: '日期',
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
    load() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()
      let value = Object.assign(query, input)
      if (input.createDate !== undefined) {
        value.startDate = input.createDate[0].format('YYYY-MM-DD HH:mm:ss')
        value.endDate = input.createDate[1].format('YYYY-MM-DD HH:mm:ss')
      }
      this.loading = true
      AccountService.transactionList(value).then(res => {
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
