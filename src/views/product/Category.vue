<template>
    <div>
        <a-row style="margin-bottom: 25px" type="flex">
            <a-col span="5">
                <a-input-search placeholder="请输入要查询的类目名称"
                                enter-button="查询"
                />
            </a-col>
            <a-col offset="2">
                <a-button @click="onOpenAddModel(-1)">新增分类</a-button>
            </a-col>
        </a-row>
        <a-row type="flex">
            <a-col class="tree-box" span="4">
                <a-tree @select="onTreeSelect"
                        :tree-data="options"
                        :default-selected-keys="defaultSelectNode"
                        :default-expand-all="true"
                        :replaceFields="{children:'children',key:'id',title:'name'}">
                    <template slot="custom" slot-scope="node">
                        <a-row type="flex">
                            <a-popover trigger="contextmenu" placement="right">
                                <template slot="content">
                                    <a-tooltip placement="bottom">
                                        <template v-show="node.depth<4" slot="title">
                                            <span>新增</span>
                                        </template>
                                        <a-icon @click="onOpenAddModel(node.id)"
                                                style="font-size: 16px;padding-right: 10px;cursor: pointer;"
                                                type="plus-circle" />
                                    </a-tooltip>
                                    <a-tooltip placement="bottom">
                                        <template slot="title">
                                            <span>编辑</span>
                                        </template>
                                        <a-icon @click="onClickSetEditModel(node.id)"
                                                style="font-size: 16px;padding-right: 10px;cursor: pointer;"
                                                type="edit" />
                                    </a-tooltip>
                                    <a-tooltip placement="bottom">
                                        <template slot="title">
                                            <span>删除</span>
                                        </template>
                                        <a-icon @click="onClickConfirm(node.id)"
                                                style="font-size: 16px;cursor: pointer;" type="delete" />
                                    </a-tooltip>
                                </template>
                                <span>{{node.name}}</span>
                            </a-popover>
                        </a-row>
                    </template>
                </a-tree>
            </a-col>
            <a-col style="min-height: 500px" offset="1">
                <a-table rowKey="id"
                         bordered
                         size="middle"
                         :columns="columns"
                         :loading="loading"
                         :pagination="false"
                         :dataSource="data">
                    <template slot="product"
                              slot-scope="value,row">
                        <div>
                            <img height="100"
                                 width="100"
                                 :src="row.productImage">
                            <span>{{row.productTitle}}</span>
                        </div>
                    </template>
                    <template slot="action"
                              slot-scope="value,row">
                        <a @click="onClickSetEditModel(row.id,3)">编辑</a>
                        <a-popconfirm @confirm="onClickDelete(row.id)" title="确认删除此类目？">
                            <a style="margin-left: 5px">删除</a>
                        </a-popconfirm>
                        <a-popconfirm @confirm="onClickDisplay(row)" v-if="row.display" title="确认禁用此类目？">
                            <a style="margin-left: 5px">禁用</a>
                        </a-popconfirm>
                        <a-popconfirm @confirm="onClickDisplay(row)" v-else title="确认恢复此类目？">
                            <a style="margin-left: 5px">恢复</a>
                        </a-popconfirm>
                    </template>
                </a-table>
            </a-col>
        </a-row>
        <a-modal :title="title" :destroyOnClose="true" :visible="addWindowVisible" @ok="onClickSubmit"
                 @cancel="onCloseAddWindow"
                 :confirm-loading="addLoading">
            <a-form-model ref="form" :label-col="{ span:4}" :wrapper-col="{span:19}" :model="entityFromModel">
                <a-form-model-item label="类目名称" required>
                    <a-input placeholder="请输入类目名称"
                             v-model="entityFromModel.name"></a-input>
                </a-form-model-item>
                <a-form-model-item label="是否显示">
                    <a-switch checked-children="展示" un-checked-children="隐藏"
                              v-model="entityFromModel.display" />
                </a-form-model-item>
                <a-form-model-item v-if="entityFromModel.path.length >0" label="当前类目">
                    <span style="font-size: 12px">{{entityFromModel.path}}</span>
                </a-form-model-item>
                <a-form-model-item label="图标" v-if="level ===2">
                    <p-upload-cell :upload-max="1" :cells="uploadImage"></p-upload-cell>
                </a-form-model-item>
                <a-form-model-item label="序号">
                    <a-input placeholder="请输入序号" v-model="entityFromModel.index"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import ProductCategoryApi from '../../service/product.category.service'
import moment from 'moment'
import uploadCell from '../../components/material/UploadCell'

export default {
  name: 'Category',
  components: {
    'p-upload-cell': uploadCell
  },
  data() {
    return {
      addWindowVisible: false,
      uploadImage: [],
      addForm: this.$form.createForm(this),
      addLoading: false,
      uploadLoading: false,
      reload: false,
      editModel: false,
      icon: '',
      level: -1,
      defaultSelectNode: [],
      selectNode: '',
      options: [],
      title: '新增类目',
      tree: [],
      entityFromModel: {
        id: -1,
        parentId: -1,
        name: '',
        display: false,
        icon: '',
        index: 0,
        path: ''
      },
      columns: [{
        title: '类目名称',
        dataIndex: 'name',
        width: '150px',
        align: 'center'
      }, {
        title: '状态',
        dataIndex: 'display',
        align: 'center',
        customRender(val) {
          if (val) {
            return '显示'
          } else {
            return '隐藏'
          }
        },
        width: '100px'
      }, {
        title: '商品数量',
        dataIndex: 'count',
        width: '150px',
        align: 'center'
      }, {
        title: '序号',
        dataIndex: 'index',
        width: '150px',
        align: 'center'
      }, {
        title: '创建日期',
        dataIndex: 'createDate',
        customRender(val) {
          return moment(val).format('YYYY-MM-DD HH:mm:ss')
        },
        width: '200px',
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: {customRender: 'action'},
        width: '200px',
        align: 'center'
      }],
      loading: false,
      data: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      ProductCategoryApi.all().then(res => {
        this.tree = res.data.result
        this.bindTree(res.data.result)
      })
    },
    onOpenAddModel(id) {
      this.editModel = false
      this.addWindowVisible = true
      this.entityFromModel.parentId = id
      let flag = id
      let path = []
      if (id > 0) {
        this.level = this.tree.find(x => x.id === id).depth + 1
        for (const node of this.tree) {
          if (node.id === flag && node.parentId === -1) {
            path.push(node.name)
            break
          } else if (node.id === flag) {
            path.push(node.name)
            flag = node.id
          }
        }
        this.entityFromModel.path = path.reverse().join(' > ')
      }
      this.title = '新增类目'
    },
    categoryFilterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    updateHandler(e) {
      if (e.file.status === 'uploading') {
        this.uploadLoading = true;
        return;
      }
      if (e.file.status === 'done') {
        this.icon = e.fileList[0].response.result.url;
        this.uploadLoading = false;
      }
    },
    onTreeSelect(keys, e) {
      let key = keys[0]
      this.data = this.tree.filter(x => x.parentId === key && x.count > 0)
    },
    onCloseAddWindow() {
      this.addWindowVisible = false
      this.icon = ''
    },
    onClickSetEditModel(id) {
      ProductCategoryApi.get({id: id}).then(res => {
        if (res.data.code === 0) {
          let data = res.data.result
          this.editModel = true
          this.level = res.data.result.depth
          this.entityFromModel.name = data.name
          this.entityFromModel.index = data.index
          this.entityFromModel.display = data.display
          this.entityFromModel.id = data.id
          this.entityFromModel.parentId = data.parentId
          if (data.icon.length > 0) {
            this.uploadImage = [data.icon]
          }
          this.addWindowVisible = true
          this.title = '编辑类目'
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    bindTree(tree) {
      let roots = tree.filter(ele => ele.parentId === -1)
        .map(x => {
          return {
            id: x.id,
            name: x.name,
            parent: null,
            depth: x.depth,
            children: [],
            scopedSlots: {title: 'custom'}
          }
        })
      let addNode = (node, ele) => {
        if (ele.count > 0) return
        if (node.id === ele.parentId) {
          node.children.push({
            id: ele.id,
            name: ele.name,
            depth: ele.depth,
            parent: node,
            children: [],
            scopedSlots: {title: 'custom'}
          })
          return
        }
        for (const child of node.children) {
          addNode(child, ele)
        }
      }
      for (let root of roots) {
        for (const node of tree) {
          addNode(root, node)
        }
      }
      this.options = roots
    },
    onClickConfirm(id) {
      let _this = this
      this.$confirm({
        title: '确认删除类目？',
        content: '请确认当前类目下没有子级类目',
        onOk() {
          _this.onClickDelete(id)
        }
      })
    },
    onClickDelete(id) {
      ProductCategoryApi.del({id: id}).then(res => {
        if (res.data.code === 0) {
          this.$message.success('删除成功')
          this.load()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onClickDisplay(row) {
      ProductCategoryApi.display({id: row.id}).then(res => {
        if (res.data.code === 0) {
          row.display = !row.display
          this.$message.success('操作成功')
        }
      })
    },
    onClickSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.addLoading = true
          if (this.uploadImage.length > 0) {
            this.entityFromModel.icon = this.uploadImage[0]
          }
          if (this.editModel) {
            ProductCategoryApi.update(this.entityFromModel).then(res => {
              this.addLoading = false
              this.loading = false
              if (res.data.code === 0) {
                this.$message.success('编辑成功')
                this.load()
              }
              this.addWindowVisible = false
            })
          } else {
            ProductCategoryApi.add(this.entityFromModel).then(res => {
              this.addLoading = false
              this.loading = false
              if (res.data.code === 0) {
                this.$message.success('添加成功')
                this.load()
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(() => {
              this.addLoading = false
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .tree-box {
        border: 1px solid #e8e8e8;
        min-height: 500px;
    }
</style>
