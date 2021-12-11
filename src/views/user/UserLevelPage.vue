<template>
    <div class="p-container">
        <a-row type="flex" align="middle" class="mb5">
            <span class="h5">免费会员模式</span>
            <span style="font-size: 14px" class="gray-6 mr10 ml10">已启用</span>
            <span style="font-size: 14px;color: #4f8aef;cursor: pointer">停用</span>
        </a-row>
        <a-row type="flex" class="gray-6 mt10">
            <span style="font-size: 14px">成为会员后，根据用户的消费、互动等行为来划分等级，如普通京东会员根据京享值划分等级。</span>
        </a-row>
        <a-row style="margin-top: 35px" type="flex">
            <a-button @click="$router.push('/user/level/config')" type="primary">添加会员等级</a-button>
            <a-button class="mr20 ml20">配置升降级规则</a-button>
            <a-button>引导开通会员</a-button>
        </a-row>
        <a-row style="margin-top: 35px">
            <a-table :loading="loading" :data-source="dataSource" :columns="columns" :pagination="false"
                     :scroll="{x:1300}"></a-table>
        </a-row>
    </div>
</template>

<script>
import UserVipLevelService from '../../service/user.level.service'

export default {
  name: 'UserLevelPage',
  data() {
    return {
      dataSource: [],
      loading: false,
      columns: [{
        title: '会员等级',
        dataIndex: 'level',
        fixed: 'left',
        customRender: (value) => {
          return <span style="color:#c95a0a;font-weight:500">{'VIP' + value}</span>
        }
      }, {
        title: '名称',
        dataIndex: 'name'
      }, {
        title: '获得等级条件',
        customRender: (value, row) => {
          if (row.isCustomLevelUpRule) {
            return (<div>
              <div>自定义升级规则</div>
              <div>{row.experience}成长值</div>
            </div>)
          } else {
            return (<div>
              <div>{row.experience}成长值</div>
            </div>)
          }
        }
      }, {
        title: '会员权益',
        customRender: () => {
          return '-'
        }
      }, {
        title: '升级礼包',
        customRender: () => {
          return '-'
        }
      }, {
        title: '保级规则',
        customRender: () => {
          return '-'
        }
      }, {
        title: '降级规则',
        customRender: () => {
          return '-'
        }
      }, {
        title: '启用状态',
        dataIndex: 'enable',
        customRender: (value) => {
          return value ? '已启用' : '已停用'
        }
      }, {
        title: '会员封面',
        dataIndex: 'vipCover',
        customRender: (value) => {
          let style = `width:64px;height:32px;border-radius:3px;background:linear-gradient(30deg, ${value} 0%, ${value} 100%)`
          return (<div
            style={style}></div>)
        }
      }, {
        title: '会员数量',
        dataIndex: 'count',
        customRender: (value, row) => {
          return '-'
        }
      }, {
        title: '操作',
        fixed: 'right',
        customRender: (value, row) => {
          let txt = row.enable ? '停用' : '启用'
          if (row.isLast) {
            return (<div>
              <router-link to={{path: '/user/level/config', query: {id: row.id}}} class="mr10">编辑</router-link>
              <a onClick={() => {
                this.onLevelChangeConfirm(row)
              }}>{txt}</a>
            </div>)
          } else {
            return (
              <router-link to={{path: '/user/level/config', query: {id: row.id}}} className="mr10">编辑</router-link>)
          }
        }
      }]
    }
  },
  created() {
    this.getDataSource()
  },
  methods: {
    getDataSource() {
      this.loading = true
      UserVipLevelService.list().then(res => {
        this.dataSource = res.data.result.map((ele, index) => {
          if (index === res.data.result.length - 1) {
            ele.isLast = true
          } else {
            ele.isLast = false
          }
          return ele
        })
        this.loading = false
      })
    },
    onLevelChangeConfirm(row) {
      let msg = ''
      if (row.enable) {
        msg = '停用等级将对已有会员造成影响，如需停用请提前公告，以免造成不必要的损失，请谨慎操作。'
      } else {
        msg = `启用等级VIP${row.level}后，会员等级将重新计算，原有的会员可能会发生等级变动，变动将在一段时间内完成`
      }

      this.$confirm({
        title: '操作提示',
        content: msg,
        onOk: () => {
          return new Promise(((resolve, reject) => {
            UserVipLevelService.enable({id: row.id}).then(res => {
              resolve()
              this.getDataSource()
            }).catch(err => {
              reject()
            })
          }))

        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    @import "../../assets/css/color.css";
</style>
