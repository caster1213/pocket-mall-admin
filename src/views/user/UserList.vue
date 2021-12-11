<template>
  <div class="components-form-demo-advanced-search">
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
        <a-col :xs="{ span:16}" :md="{span:8}">
          <a-form-item label="推荐人">
            <a-input v-decorator="['parentName']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="{ span:16}" :md="{span:8}">
          <a-form-item label="推荐人电话">
            <a-input v-decorator="['parentPhone']"></a-input>
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
    <div class="search-result-list">
      <a-table
          rowKey="id"
          :columns="columns"
          :loading="loading"
          :dataSource="data"
          :pagination="pagination"
          :scroll="{x:2200}"
          @change="onPageChange"
      >
        <template slot="action" slot-scope="val,row">
          <a-button type="link" class="text-action-btn" @click="()=> {
                        manualRechargeModelVisible = true
                        currentRow = row
                    }">余额充值
          </a-button>
          <a-button type="link" class="text-action-btn" @click="()=> {
                       userTeamSelectModel.visible = true
                       userTeamSelectModel.uid = row.id
                       userTeamSelectModel.name = row.nickname
                    }">查看团队
          </a-button>
          <a-popconfirm @confirm="del(row)" title="确认删除此会员？">
            <a-button type="link" class="text-action-btn" style="margin-left: 5px">冻结</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal :confirm-loading="manualRechargeModelLoading" title="余额充值" @ok="onRechargeAmount"
             @cancel="()=> this.manualRechargeModelVisible = false"
             :visible="manualRechargeModelVisible">
      <a-form-model ref="rechargeAmountModel" :model="manualRechargeModel"
                    :labelCol="{ xs:{ span:24},sm:{span:7}}"
                    :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                    :rules="manualRechargeModelRule">
        <a-form-model-item required label="充值金额" prop="amount">
          <a-input v-model="manualRechargeModel.amount" placeholder="输入充值金额"/>
        </a-form-model-item>
        <a-form-model-item required label="备注" prop="remark">
          <a-textarea v-model="manualRechargeModel.remark" style="resize: none" :rows="5"
                      placeholder="最多100个字，需要备注充值原因"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :confirm-loading="loading" title="追加VIP积分" @ok="appendValue"
             @cancel="()=> this.updateValueWindowVisible = false"
             :visible="updateValueWindowVisible">
      <a-form :form="updateValueForm">
        <a-form-item :labelCol="{ xs:{ span:24},sm:{span:7}}" :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                     label="VIP积分">
          <a-input v-decorator="['value',{rules:[{required:true,message:'请输入追加的VIP积分'}]}]"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <user-team-select @close="userTeamSelectModel.visible = false" :uid="userTeamSelectModel.uid"
                      :name="userTeamSelectModel.name" :visible="userTeamSelectModel.visible"/>
  </div>
</template>

<script>
import moment from 'moment'
import UserService from '../../service/user.service'
import AccountService from '../../service/account.service'
import UserLevelConfig from '../../service/user.level.service'
import UserTeamSelect from './UserTeamSelect'
import common from '../../common/common'
import query from '../../mixin/query'

export default {
  name: 'UserList',
  components: {
    UserTeamSelect
  },
  mixins: [query],
  data() {
    let _this = this
    return {
      queryForm: this.$form.createForm(this),
      addUserForm: this.$form.createForm(this),
      updateValueForm: this.$form.createForm(this),
      addUserWindowVisible: false,
      updateValueWindowVisible: false,
      currentRow: {id: '', userId: ''},
      manualRechargeModel: {
        userId: '',
        amount: '',
        remark: ''
      },
      manualRechargeModelVisible: false,
      userTeamSelectModel: {
        visible: false,
        uid: ''
      },
      manualRechargeModelRule: {
        amount: [{
          required: true,
          message: '必须填写充值金额'
        }],
        remark: [{
          required: true,
          message: '必须填写原因'
        }, {
          max: 100,
          message: '最多只能输入100个字'
        }]
      },
      loading: false,
      manualRechargeModelLoading: false,
      columns: [{
        title: '姓名',
        dataIndex: 'nickname',
        customRender: (value, row) => {
          let query = {
            path: '/users/detail',
            query: {
              uid: row.id
            }
          }
          return <router-link to={query}>{value}</router-link>
        }
      }, {
        title: '手机',
        dataIndex: 'phone'
      }, {
        title: '可用余额',
        dataIndex: 'availableAmount'
      }, {
        title: '冻结余额',
        dataIndex: 'freezeAmount'
      }, {
        title: '等级',
        dataIndex: 'level',
        customRender(value) {
          let index = _this.levels.findIndex(x => x.level === value)
          if (index === -1) {
            return '-'
          } else {
            return _this.levels[index].name
          }
        }
      }, {
        title: '推荐人',
        dataIndex: 'parentName'
      }, {
        title: '注册',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作',
        fixed: 'right',
        scopedSlots: {customRender: 'action'}
      }],
      data: [],
      levels: []
    }
  },
  created() {
    this.loadLevel()
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
    load() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let input = this.queryForm.getFieldsValue()
      let value = Object.assign(query, input)
      this.loading = true
      UserService.list(value).then(res => {
        this.data = res.data.result.list
        this.pagination.total = res.data.result.total
        this.loading = false
      })
    },
    loadLevel() {
      UserLevelConfig.list().then(res => {
        this.levels = res.data.result
      })
    },
    onRechargeAmount() {
      this.$refs.rechargeAmountModel.validate((valid) => {
        if (valid) {
          this.manualRechargeModel.userId = this.currentRow.id
          this.manualRechargeModelLoading = true
          AccountService.rechargeAmount(this.manualRechargeModel).then(res => {
            if (common.isSuccess(res)) {
              this.manualRechargeModelLoading = false
              this.$message.success('修改成功！')
              this.$refs.rechargeAmountModel.resetFields()
              this.manualRechargeModelVisible = false
              this.load()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },

    del(row) {
      UserService.del({id: row.id}).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('删除成功')
          this.load()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    appendValue() {
      this.updateValueForm.validateFields((error, values) => {
        if (error !== null) return
        this.loading = true
        values.id = this.currentRow.id
        AccountService.appendValue(values).then(res => {
          this.updateValueWindowVisible = false
          if (res.data.code === 0) {
            this.$message.success('追加成功')
            this.load()
          }
        })
      })
    },
    alert() {
      console.log(this.userTeamSelectModel)
    }
  }
}
</script>

<style scoped>

</style>
