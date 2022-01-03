<template>
  <div class="components-form-demo-advanced-search">
    <div style="margin-bottom: 25px">
      <a-button @click="$router.push('/product/group/add')" type="primary">创建分组
      </a-button>
    </div>
    <div class="search-result-list">
      <a-table
          rowKey="id"
          :columns="columns"
          :loading="loading"
          :dataSource="data"
          :pagination="pagination"
          @change="onChange"
      >
        <template slot="action" slot-scope="val,row">
          <router-link tag="a" :to="{path:'/product/update',query:{id:row.id}}">编辑</router-link>
        </template>
      </a-table>
    </div>
    <a-modal :title="title" :visible="addGroupWindowVisible" @cancel="()=> addGroupWindowVisible = false" @ok="add">
      <a-form-model ref="form" :model="model" :rules="{
              'name':[{
                required:true,message:'请填写分组名称'
              }]
            }">
        <a-form-model-item required :labelCol="{ xs:{ span:24},sm:{span:7}}"
                           :wrapperCol="{xs:{ span:24},sm:{span:13}}"
                           label="分组名称">
          <a-input v-model="model.name" prop="name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import ProductService from '@/service/product.service'
import moment from 'moment'
import common from '@/common/common'

export default {
  name: 'Group',
  data() {
    return {
      queryForm: this.$form.createForm(this),
      addGroupWindowVisible: false,
      editStatus: false,
      model: {
        id: 0,
        name: ''
      },
      columns: [{
        title: '分组名称',
        dataIndex: 'name',
      }, {
        title: '商品数量',
        dataIndex: 'productTotal'
      }, {
        title: '创建时间',
        dataIndex: 'createDate',
        customRender(value) {
          return moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '编辑',
        customRender: (value, row) => {
          return (
              <div>
                <a-button onClick={() => {
                   this.$router.push({
                     path:'/product/group/update',
                     query:{id:row.id}
                   })
                }} class="text-action-btn" type="link">
                  编辑
                </a-button>
                <a-popconfirm title="确定要删除该分组吗" onConfirm={() => {
                  this.onDelete(row.id)
                }}>
                  <a-button class="text-action-btn" type="link">
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
          )
        }
      }],
      data: [],
      loading: false,
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
  computed: {
    title() {
      return this.editStatus ? '修改分组' : '添加分组'
    }
  },
  created() {
    this.load()
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
      this.loading = true
      ProductService.groupList(value).then(res => {
        this.data = res.data.result.list
        this.pagination.total = res.data.result.total
        this.loading = false
      })
    },
    add() {
      this.$refs.form.validate((valid) => {
        console.log('123')
        if (!valid) return
        this.loading = true
        if (this.editStatus) {
          ProductService.updateGroup(this.model).then(res => {
            this.addGroupWindowVisible = false
            if (res.data.code === 0) {
              this.$message.success('保存成功')
              this.model.name = ''
              this.model.id = 0
              this.load()
            }
          })
        } else {
          ProductService.addGroup(this.model).then(res => {
            this.addGroupWindowVisible = false
            if (res.data.code === 0) {
              this.$message.success('保存成功')
              this.model.name = ''
              this.load()
            }
          })
        }
      })
    },
    onDelete(id) {
      ProductService.deleteGroup({
        id: id
      }).then(res => {
        if (common.isSuccess(res)) {
          this.$message.success('删除成功')
          this.load()
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
