<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box-bg-white p-box">
                <a-form-model ref="filterForm" :model="filter" class="filter" layout="inline">
                    <a-form-model-item label="员工工号" prop="employeeNumber">
                        <a-input v-model="filter.employeeNumber" />
                    </a-form-model-item>
                    <a-form-model-item label="员工姓名" prop="employeeName">
                        <a-input v-model="filter.employeeName" />
                    </a-form-model-item>
                    <a-form-model-item label="联系电话" prop="employeePhone">
                        <a-input v-model="filter.employeePhone" />
                    </a-form-model-item>
                    <a-form-model-item label="所属角色">
                        <a-select v-model="filter.roleId" allowClear>
                            <a-select-option v-for="role in roles" :key="role.roleId" :value="role.roleId">
                                {{role.roleName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
                <a-row type="flex">
                    <a-button @click="query" :loading="loading" class="p-input-right" type="primary">查询</a-button>
                    <a-button @click="clearFilter">重置</a-button>
                </a-row>
            </div>
            <div class="p-box-bg-white p-box">
                <div class="table-tool">
                    <div class="title">
                        <h3>员工列表</h3>
                    </div>
                    <div>
                        <a-button @click="onOpenEmployeeDialog" type="primary">创建</a-button>
                    </div>
                </div>
                <a-table :row-key="tableOption.rowKey" :columns="tableOption.columns"
                         :loading="loading"
                         :data-source="tableOption.dataSource" :pagintion="tableOption.pagination"></a-table>
            </div>
        </div>
        <p-footer-page @nextPage="onChangePage" @nextPageSize="onChangePage" :page-total="pageOption.pageTotal"
                       :page-index="pageOption.pageIndex"
                       :page-size="pageOption.pageSize" />
        <a-modal :title="employeeDialog.title" :visible="employeeDialog.visible"
                 :confirm-loading="employeeDialog.loading"
                 @cancel="onCloseEmployeeDialog" @ok="onConfirmEmployeeDialog">
            <a-form-model ref="employeeForm" :model="employeeDialog.model" :rules="employeeDialog.rules"
                          :label-col="{span:5}"
                          :wrapper-col="{span:10}">
                <a-form-model-item label="员工姓名" prop="employeeName">
                    <a-input v-model="employeeDialog.model.employeeName" />
                </a-form-model-item>
                <a-form-model-item label="员工工号" prop="employeeNumber">
                    <a-input v-model="employeeDialog.model.employeeNumber" />
                </a-form-model-item>
                <a-form-model-item label="联系电话" prop="employeePhone">
                    <a-input v-model="employeeDialog.model.employeePhone" />
                </a-form-model-item>
                <a-form-model-item label="员工角色" prop="roleId">
                    <a-select v-model="employeeDialog.model.roleId">
                        <a-select-option v-for="role in roles" :key="role.roleId" :value="role.roleId">
                            {{role.roleName}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="员工状态">
                    <a-radio-group v-model="employeeDialog.model.employeeStatus">
                        <a-radio value="1">正常</a-radio>
                        <a-radio value="2">禁止</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import EmployeeAPI from '../../service/employee.service'
import PermissionAPI from '../../service/permission.service'
import constant from '../../common/constant'
import moment from 'moment'

export default {
  name: 'EmployeePage',
  data() {
    return {
      loading: false,
      filter: {
        roleId: '',
        employeeName: '',
        employeePhone: '',
        employeeNumber: '',
      },
      tableOption: {
        columns: [{
          title: '员工工号',
          dataIndex: 'employeeNumber'
        }, {
          title: '员工姓名',
          dataIndex: 'employeeName'
        }, {
          title: '联系电话',
          dataIndex: 'employeePhone'
        }, {
          title: '所属角色',
          dataIndex: 'roleName'
        }, {
          title: '添加时间',
          dataIndex: 'createDate',
          customRender(value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
          }
        }, {
          title: '状态',
          dataIndex: 'employeeStatus',
          customRender(value) {
            if (value === 1) {
              return '正常'
            } else {
              return '禁止'
            }
          }
        }, {
          title: '操作',
          customRender: (v, row) => {
            return (<a onClick={() => this.onOpenUpdateDialog(row)}>编辑</a>)
          }
        }],
        dataSource: [],
        rowKey: 'employeeId',
        pagination: false
      },
      pageOption: {
        pageIndex: 1,
        pageSize: 25,
        pageTotal: 0
      },
      roles: [],
      employeeDialog: {
        visible: false,
        title: '',
        action: '',
        loading: false,
        rules: {
          employeeName: [{
            required: true, message: '必须填写员工姓名', trigger: 'blur'
          }],
          employeeNumber: [{
            required: true, message: '必须填写员工工号', trigger: 'blur'
          }],
          employeePhone: [{
            required: true, message: '必须填写联系电话', trigger: 'blur'
          }],
          roleId: [{
            required: true, message: '必须选择员工角色', trigger: 'blur'
          }]
        },
        model: {
          employeeId: '',
          employeeName: '',
          employeePhone: '',
          employeeNumber: '',
          employeeStatus: '1',
          roleId: ''
        }
      }
    }
  },
  mounted() {
    this.query()
    PermissionAPI.getRole().then(res => {
      this.roles = res.data.result.roles
    })
  },
  methods: {
    getFilterOption() {
      let option = {
        pageIndex: this.pageOption.pageIndex,
        pageSize: this.pageOption.pageSize
      }
      return Object.assign(this.filter, option)
    },
    onChangePage(pageIndex, pageSize) {
      this.pageOption.pageIndex = pageIndex
      this.pageOption.pageSize = pageSize
      this.query()
    },
    query() {
      let req = this.getFilterOption()
      this.loading = true
      EmployeeAPI.list(req).then(res => {
        this.loading = false
        this.tableOption.dataSource = res.data.result.list
        this.pageOption.pageTotal = res.data.result.total
      })
    },
    clearFilter() {
      this.$refs.filterForm.resetFields()
    },
    onOpenEmployeeDialog() {
      this.employeeDialog.visible = true
      this.employeeDialog.title = '新建员工'
      this.employeeDialog.action = 'add'
    },
    onOpenUpdateDialog(edit) {
      this.employeeDialog.visible = true
      this.employeeDialog.title = '编辑员工'
      this.employeeDialog.action = 'update'
      this.employeeDialog.model.employeeId = edit.employeeId
      this.employeeDialog.model.employeeNumber = edit.employeeNumber
      this.employeeDialog.model.employeeName = edit.employeeName
      this.employeeDialog.model.employeePhone = edit.employeePhone
      this.employeeDialog.model.employeeStatus = edit.employeeStatus.toString()
      this.employeeDialog.model.roleId = edit.roleId
    },
    onCloseEmployeeDialog() {
      this.closeEmployeeDialog()
    },
    onConfirmEmployeeDialog() {
      this.$refs.employeeForm.validate(valid => {
        if (valid) {
          this.employeeDialog.loading = true
          if (this.employeeDialog.action === 'add') {
            EmployeeAPI.create(this.employeeDialog.model).then(res => {
              this.employeeDialog.loading = false
              if (res.data.code === constant.serviceCode.success) {
                this.$message.success('添加成功！')
                this.query()
                this.closeEmployeeDialog()
              } else {
                this.$message.error('添加失败 ' + res.data.msg)
              }
            }).catch(err => {
              this.employeeDialog.loading = false
            })
          } else {
            EmployeeAPI.update(this.employeeDialog.model).then(res => {
              this.employeeDialog.loading = false
              if (res.data.code === constant.serviceCode.success) {
                this.$message.success('编辑成功！')
                this.query()
                this.closeEmployeeDialog()
              } else {
                this.$message.error('编辑失败 ' + res.data.msg)
              }
            }).catch(err => {
              this.employeeDialog.loading = false
            })
          }
        }
      })
    },
    closeEmployeeDialog() {
      this.employeeDialog.visible = false
      this.$refs.employeeForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
    .filter {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        & /deep/ .ant-form-item {
            display: flex;
            align-items: center;
            width: 30%;
        }

        & /deep/ .ant-form-item-control-wrapper {
            width: 70%;
        }
    }

    .table-tool {
        margin-left: 16px;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
    }
</style>
