<template>
  <a-modal @close="onClose" @cancel="onClose" @ok="onConfirm" width="815px" title="页面" :visible="isShow">
    <a-tabs @change="onTabChange" class="page-select-table" default-active-key="1">
      <a-tab-pane row-key="id" key="1" tab="功能页面">
        <a-table row-key="id" :columns="actionPageOption.columns" :data-source="actionPageOption.data"
                 :pagination="false" size="small"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="商品分组">
        <a-table row-key="id" :columns="goodsGroupOption.columns" :data-source="goodsGroupOption.data" :pagination="goodsGroupOption.pagination" @change="onGroupChange"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="商品详情">
        <a-row type="flex" justify="space-between" class="goods-filter-container">
          <a-row type="flex" align="middle">
            <a-select v-model="goodsOption.filter.groupId" :default-value="-1" style="width: 100px">
              <a-select-option :value="-1">全部分组</a-select-option>
              <a-select-option v-for="g in goodsGroupOption.data" :key="g.id" :value="g.id">{{
                  g.name
                }}
              </a-select-option>
            </a-select>
            <a-row style="margin-left: 10px">
              <a-checkbox v-model="goodsOption.filter.isSaleStatus" style="font-size: 13px">只显示已上架
              </a-checkbox>
            </a-row>
          </a-row>
          <a-row type="flex" align="middle">
            <span class="mr10" style="font-size: 13px">价格</span>
            <div class="ml5 mr5">
              <a-input v-model="goodsOption.filter.minPrice" style="width:60px"></a-input>
            </div>
            <span>-</span>
            <div class="mr5 ml5">
              <a-input v-model="goodsOption.filter.maxPrice" style="width:60px"></a-input>
            </div>
            <a-input-search v-model="goodsOption.filter.name" @search="onGoodsSearch" placeholder="输入商品名称"
                            style="width: 160px">
              <a-button style="font-size: 13px" slot="enterButton">
                搜索
              </a-button>
            </a-input-search>
          </a-row>
        </a-row>
        <a-table row-key="id" :columns="goodsOption.columns" :data-source="goodsOption.data"
                 :pagination="goodsOption.pagination" @change="onGoodsChange" :loading="goodsOption.loading"/>
      </a-tab-pane>
      <a-tab-pane key="4" tab="活动促销">

      </a-tab-pane>
      <a-tab-pane key="5" tab="互动营销">
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>

import ProductService from '../service/product.service'
import constant from '../common/constant';
import common from '../common/common';

export default {
  name: 'PageLinkSelectPricker',
  props: {
    visible: Boolean
  },
  data() {
    return {
      isShow: false,
      selectOption: {key: '', value: '', name: ''},
      actionPageOption: {
        columns: [{
          dataIndex: 'name',
          title: '页面名称'
        }, {
          customRender: (value, row) => {
            let selected = false;
            if (this.selectOption.key === 'action-page') {
              selected = row.value === this.selectOption.value;
            }
            return (<div class="last">
              <a onClick={() => {
                this.onSelected('action-page', row.value, row.name)
              }}>{selected ? '已选择' : '选择连接'}</a>
            </div>)
          }
        }],
        data: [{
          id: 1,
          name: '首页',
          value: 'index-home'
        }, {
          id: 2,
          name: '购物车',
          value: 'index-shopping-cart'
        }, {
          id: 3,
          name: '个人中心',
          value: 'index-my'
        }, {
          id: 4,
          name: '多人拼团',
          value: '/group-buy'
        },{
          id: 5,
          name: '日历签到',
          value: '/sign'
        }]
      },
      goodsGroupOption: {
        columns: [{
          dataIndex: 'name',
          title: '分组名称'
        }, {
          customRender: (value, row) => {
            let selected = false;
            if (this.selectOption.key === 'goods-group-page') {
              selected = row.id === this.selectOption.value;
            }

            return (<div class="last">
              <a onClick={() => {
                this.onSelected('goods-group-page', row.id, row.name)
              }}>{selected ? '已选择' : '选择连接'}</a>
            </div>)
          }
        }],
        data: [],
        pagination: {
          total: 0,
          pageSize: 15,
          showQuickJumper: true,
          defaultPageSize: 15,
          current: 1
        }
      },
      goodsOption: {
        columns: [{
          dataIndex: 'title',
          width: 300,
          title: '商品名称',
          customRender: (value, row) => {
            return (
                <div style="display:flex;">
                  <img height="30px" width="30px" src={row.image.split(',')[0]}/>
                  <div style="font-size:12px;margin-left:10px;">{row.title}</div>
                </div>
            );
          }
        }, {
          title: '价格',
          customRender: (value, row) => {
            if (row.minSalePrice === row.maxSalePrice) {
              return `¥ ${row.minSalePrice}`
            } else {
              return `¥ ${row.minSalePrice} - ${row.maxSalePrice}`
            }

          }
        }, {
          dataIndex: 'saleStatus',
          title: '商品状态',
          customRender: (value) => {
            if (value === 1) {
              return '销售中'
            } else {
              return '已下架'
            }

          }
        }, {
          customRender: (value, row) => {
            let selected = false;
            if (this.selectOption.key === 'goods-page') {
              selected = row.id === this.selectOption.value;
            }

            return (<div class="last">
              <a onClick={() => {
                this.onSelected('goods-page', row.id, row.title)
              }}>{selected ? '已选择' : '选择连接'}</a>
            </div>)
          }
        }],
        data: [],
        filter: {
          name: '',
          groupId: -1,
          isSaleStatus: true,
          minPrice: '',
          maxPrice: ''
        },
        loading: false,
        pagination: {
          total: 0,
          showQuickJumper: true,
          pageSize: 15,
          defaultPageSize: 15,
          current: 1
        }
      }
    }
  },
  watch: {
    visible(newValue) {
      this.isShow = newValue;
    }
  },
  methods: {

    onTabChange(key) {
      if (key === '2') {
        this.loadGoodsGroup();
      }
      if (key === '3') {
        this.loadGoods();
      }
    },

    onGoodsChange(event) {
      this.goodsOption.pagination.current = event.current
      this.goodsOption.pagination.pageSize = event.pageSize
      this.loadGoods()
    },
    onGroupChange(event) {
      this.goodsGroupOption.pagination.current = event.current
      this.goodsGroupOption.pagination.pageSize = event.pageSize
      this.loadGoodsGroup()
    },
    loadGoods() {
      let request = {
        pageIndex: this.goodsOption.pagination.current,
        pageSize: this.goodsOption.pagination.pageSize,
      }
      if (this.goodsOption.filter.groupId !== -1) {
        request.groupId = this.goodsOption.filter.groupId
      }
      if (this.goodsOption.filter.isSaleStatus) {
        request.productStatus = constant.productStatus.now
      }
      if (this.goodsOption.filter.name.length > 0) {
        request.title = this.goodsOption.filter.name
      }
      if (common.regex.decimal2.test(this.goodsOption.filter.minPrice) && common.regex.decimal2.test(this.goodsOption.filter.maxPrice)) {
        request.minPrice = this.goodsOption.filter.minPrice
        request.maxPrice = this.goodsOption.filter.maxPrice
      }
      this.goodsOption.loading = true
      ProductService.list(request).then(res => {
        this.goodsOption.loading = false
        this.goodsOption.pagination.total = res.data.result.total;
        this.goodsOption.data = res.data.result.list.map(ele => {
          return {
            id: ele.id,
            title: ele.title,
            image: ele.imageUrl,
            minSalePrice: ele.minSalePrice,
            maxSalePrice: ele.maxSalePrice,
            saleStatus: ele.saleStatus
          }
        });
      })
    },
    loadGoodsGroup() {
      let request = {
        pageIndex: this.goodsGroupOption.pagination.current,
        pageSize: this.goodsGroupOption.pagination.pageSize,
      }
      ProductService.groupList(request).then(res => {
        this.goodsGroupOption.pagination.total = res.data.result.total;
        this.goodsGroupOption.data = res.data.result.list.map(ele => {
          return {
            id: ele.id,
            name: ele.name
          }
        });
      })
    },
    onSelected(key, value, name) {
      this.selectOption.key = key;
      this.selectOption.value = value;
      this.selectOption.name = name;
    },
    onConfirm() {
      this.$emit('confirm', this.selectOption);
    },
    onClose() {
      this.$emit('close');
    },
    onGoodsSearch() {
      this.loadGoods()
    }
  }
}
</script>

<style lang="less" scoped>
.page-select-table {
  .last {
    text-align: right;
  }
}

.goods-filter-container {
  margin-bottom: 15px;
}
</style>
