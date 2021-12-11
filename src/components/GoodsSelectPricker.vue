<template>
  <a-modal width="80%" @close="onClose" @cancel="onClose" @ok="onConfirm" :title="title" :visible="visible">
    <div class="goods-select-picker-container">
      <div class="goods-select-picker-menu">
        <a-radio-group @change="onMenuChange" v-model="radioSelectValue" :default-value="radioSelectValue">
          <a-radio value="goods" style="margin-bottom: 8px">商品</a-radio>
          <div class="goods-select-picker-menu-child goods-select-picker-menu-child-active">选择商品</div>
          <a-radio v-if="isShowProductGroup" value="group">商品分组</a-radio>
        </a-radio-group>
      </div>
      <div v-if="radioSelectValue === 'goods'" class="goods-select-picker-content">
        <div class="goods-select-picker-content-toolbar">
          <div class="left">
            <div>商品管理</div>
            <div @click="onRefresh">刷新</div>
          </div>
          <div class="right">
            <a-select default-value="-1">
              <a-select-option value="-1">所有商品</a-select-option>
            </a-select>
            <a-select @change="onRefresh" v-model="filter.groupId" :default-value="-1">
              <a-select-option v-for="ele in goodsGroupOptions" :key="ele.key" :value="ele.key">
                {{ ele.value }}
              </a-select-option>
            </a-select>
            <a-input-search v-model="filter.title" @search="onRefresh" placeholder="搜索商品或者编码"/>
          </div>
        </div>
        <div class="goods-select-picker-content-result">
          <a-table row-key="id"
                   :loading="loading"
                   :columns="goodsColumns"
                   :data-source="dataSource"
                   :scroll="{y:450}"
                   @change="onNextPage"
                   :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectRowKeyChange,type:isSingleSelect ? 'radio' : 'checkbox',getCheckboxProps:updateCheckboxStatus}"
                   :pagination="pagination"></a-table>
        </div>
      </div>
      <div v-else class="goods-select-picker-content">
        <div class="goods-select-picker-content-toolbar">
          <div class="left">
            <div>分组管理</div>
            <div @click="onRefresh">刷新</div>
          </div>
          <div class="right">
            <a-input-search v-model="filter.title" @search="onRefresh" placeholder="搜索商品分组名称"/>
          </div>
        </div>
        <div class="goods-select-picker-content-result">
          <a-table row-key="id"
                   :loading="loading"
                   :columns="groupColumns"
                   :data-source="dataSource"
                   :scroll="{y:450}"
                   @change="onNextPage"
                   :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectRowKeyChange,type:isSingleSelect ? 'radio' : 'checkbox'}"
                   :pagination="pagination"></a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import ProductService from '../service/product.service'

export default {
  name: 'GoodsSelectPricker',
  props: {
    title: String,
    visible: Boolean,
    selectGoodsRows: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectType: {
      type: String,
      default: 'goods'
    },
    selectMenus: {
      type: Array,
      default: () => {
        return []
      }
    },
    isSingleSelect: {
      type: Boolean,
      default: false
    },
    isShowProductGroup: {
      type: Boolean,
      default: true
    },
    isActivityFilter: {
      type: Boolean,
      default: false
    },
    currentActivityType: {
      type: Number,
      default: -1
    },
  },
  watch: {
    visible() {
      this.selectedRowKeys = this.selectGoodsRows.map(x => x.id)
      this.selectedRows = this.selectGoodsRows
      this.radioSelectValue = this.selectType
    }
  },
  created() {
    this.loadGoods()
    this.loadGroup();
  },
  data() {
    return {
      filter: {
        title: '',
        groupId: -1
      },
      isShow: false,
      loading: false,
      radioSelectValue: 'goods',
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        total: 0,
        showQuickJumper: true,
        pageSize: 25,
        defaultPageSize: 25,
        current: 1,
        showTotal: total => {
          //let pageNum = Math.ceil(total / this.pagination.pageSize)
          return (
              <div>
                <span>共{total}条</span>
                <span style="margin-left: 10px;">每页25条</span>
              </div>
          )
        }
      },
      groupColumns: [{
        title: '分组名称',
        dataIndex: 'name'
      }, {
        title: '商品数量',
        dataIndex: 'productTotal'
      }],
      goodsColumns: [{
        title: '商品名称',
        width: 260,
        customRender: (value, row) => {
          return (
              <div class="goods-title">
                <div>
                  <img src={row.imageUrl.split(',')[0]}/>
                </div>
                <div class="info">
                  <div class="line2">{row.title}</div>
                  <div>¥{row.minSalePrice.toDecimalString()}</div>
                </div>
              </div>
          )
        }
      }, {
        title: '商品分组'
      }, {
        title: '库存',
        dataIndex: 'inventory'
      }, {
        title: '累计销量',
        dataIndex: 'saleCount'
      }, {
        title: '已参与活动',
        customRender: (val, row) => {
          if (row.activityList.length === 0) return '-'
          return (<div class="select-activity">
            <ul>
              {
                row.activityList.map(ele => {
                  return <li>
                    <a>{ele.name}</a>
                  </li>
                })
              }
            </ul>
          </div>)
        }
      }, {
        title: '不可选原因',
        customRender: (value, row) => {
          if (row.isSelected === false) {
            return row.notSelectMsg
          } else {
            return '-'
          }
        }
      }],
      dataSource: [],
      goodsGroupOptions: [{
        key: -1,
        value: '商品分组'
      }]
    }
  },
  methods: {
    onSelectRowKeyChange(selectedRowKeys, selectedRows) {
      this.selectedRows = [...selectedRows]
      this.selectedRowKeys = [...selectedRowKeys]
    },
    onClose() {
      this.$emit('close')
    },
    onConfirm() {
      this.$emit('confirm', this.selectedRows, this.radioSelectValue)
    },
    loadGoods() {
      let request = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        isActivityFilter: this.isActivityFilter
      }
      if (this.currentActivityType !== -1) {
        request.ActivityGenre = this.currentActivityType
      }
      if (this.filter.groupId !== -1) {
        request.groupId = this.filter.groupId
      }
      if (this.filter.title.length > 0) {
        request.title = this.filter.title
      }
      this.loading = true
      ProductService.list(request).then(res => {
        this.loading = false
        this.pagination.total = res.data.result.total
        this.dataSource = res.data.result.list
      })
    },
    onNextPage(e) {
      this.pagination.current = e.current
      this.loadGoods()
    },
    loadGroup() {
      ProductService.groupList({
        pageIndex: 1,
        pageSize: 100
      }).then(res => {
        res.data.result.list.forEach(ele => {
          this.goodsGroupOptions.push({
            key: ele.id,
            value: ele.name
          })
        })
      })
    },
    loadGoodsGroup() {
      let request = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      this.loading = true
      ProductService.groupList(request).then(res => {
        this.loading = false
        this.dataSource = res.data.result.list
        this.pagination.total = res.data.result.total
      })
    },
    updateCheckboxStatus(row) {
      return {
        props: {
          disabled: row.isSelected === false
        }
      }
    },
    onRefresh() {
      this.pagination.current = 1
      this.loadGoods()
    },
    onMenuChange() {
      this.dataSource = []
      this.pagination.current = 1
      if (this.radioSelectValue === 'goods') {
        this.loadGoods()
      } else {
        this.loadGoodsGroup()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.line2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-select-picker-container {
  display: flex;
}

.goods-select-picker-menu {
  width: 150px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #ededef;

  .goods-select-picker-menu-child {
    margin: 0 20px 8px 0;
    display: flex;
    padding-left: 25px;
    align-items: center;
    height: 32px;
    cursor: pointer;
  }

  .goods-select-picker-menu-child-active {
    background-color: #f7f8fa;
  }

}

.goods-select-picker-content {
  width: 100%;
  padding: 0 20px;

  .goods-select-picker-content-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      font-size: 13px;
      color: #1d61d6;

      div {
        cursor: pointer;
      }

      :nth-child(2) {
        margin-left: 10px;
      }
    }

    .right {

      & /deep/ .ant-select {
        width: 120px;
        margin-left: 10px;
      }

      & /deep/ .ant-input-search {
        width: 180px;
        margin-left: 10px;
      }
    }
  }

  .goods-select-picker-content-result {
    margin-top: 15px;

    .goods-title {
      display: flex;

      &:nth-child(1) img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }

      .info {
        width: 160px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        & :nth-child(2) {
          color: #ed6a0c;
        }
      }
    }

    .select-activity {
      ul li {
        list-style: none;
      }
    }
  }
}
</style>
