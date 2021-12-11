<template>
    <a-modal :width="680" :closable="true" @cancel="onClose" @ok="onClose" :visible="isShow" :title="title">
        <a-row class="mb15" type="flex" justify="end">
            <a-input-search @search="()=>{
              pagination.current =1
              load()
            }" v-model.number="index" placeholder="输入搜索的层级" style="width: 180px">
                <a-button :loading="loading" type="primary" style="font-size: 13px" slot="enterButton">
                    搜索
                </a-button>
            </a-input-search>
        </a-row>
        <a-table row-key="id" :loading="loading" :columns="columns" :data-source="dataSource" :pagination="pagination"
                 @change="next"></a-table>
    </a-modal>
</template>

<script>
import UserService from '../../service/user.service'

export default {
  name: 'UserTeamSelect',
  props: {
    uid: String,
    name: String,
    visible: Boolean
  },
  data() {
    return {
      isShow: false,
      dataSource: [],
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
      },
      index: 1,
      columns: [{
        title: '姓名',
        dataIndex: 'nickname'
      }, {
        title: '电话',
        dataIndex: 'phone'
      }, {
        title: '个人业绩',
        dataIndex: 'personalSale'
      }, {
        title: '推荐人',
        dataIndex: 'parentName'
      }, {
        title: '等级',
        dataIndex: 'level'
      }, {
        title: '所在层级',
        dataIndex: 'distance'
      }]
    }
  },
  computed: {
    title() {
      return this.name + '的团队'
    }
  },
  watch: {
    visible(nValue) {
      this.isShow = nValue;
      console.log('visible=' + nValue)
      if (this.isShow) {
        this.load()
      }
    }
  },
  created() {
  },
  methods: {
    load() {
      this.loading = true
      UserService.getChildren({
        parentId: this.uid,
        distance: this.index,
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.dataSource = res.data.result.list
        this.pagination.total = res.data.result.total
      })
    },
    next(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.load()
    },
    onClose() {
      this.pagination.current = 1
      this.index = 1
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
