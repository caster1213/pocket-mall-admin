<template>
  <div class="components-form-demo-advanced-search">
    <div style="margin-bottom: 25px">
      <a-button @click="() => $router.push('/product/add')" type="primary"
      >发布商品
      </a-button>
    </div>
    <div class="p-box">
      <a-row>
        <a-form-model ref="queryForm" layout="inline">
          <a-form-model-item label="商品名称">
            <a-input v-model="queryForm.title"/>
          </a-form-model-item>
          <a-form-model-item label="商品分组">
            <a-select
                v-model="queryForm.groupId"
                :allow-clear="true"
                style="width: 180px"
                placeholder=""
            >
              <a-select-option v-for="g in group" :key="g.id" :value="g.id">{{
                  g.name
                }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="销售区域">
            <a-select style="width:120px"  :allow-clear="true" v-model="queryForm.saleArea">
              <a-select-option value="1">售卖区</a-select-option>
              <a-select-option value="2">特价区</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="商品类目">
            <a-cascader
                class="font-size-12"
                v-model="queryForm.categoryId"
                placeholder=""
                :load-data="queryCategoryTree"
                :options="categoryOptions"
            />
          </a-form-model-item>
          <a-form-model-item label="价格">
            <a-input
                v-model="queryForm.minSalePrice"
                addon-after="元"
                class="font-size-12"
                style="width: 100px"
            />
            <span class="ml10 mr10">-</span>
            <a-input
                v-model="queryForm.maxSalePrice"
                addon-after="元"
                class="font-size-12"
                style="width: 100px"
            />
          </a-form-model-item>
          <a-form-model-item label="销量">
            <a-input
                v-model="queryForm.minSaleCount"
                class="font-size-12"
                style="width: 80px"
            />
            <span class="ml10 mr10">-</span>
            <a-input
                v-model="queryForm.maxSaleCount"
                class="font-size-12"
                style="width: 80px"
            />
          </a-form-model-item>
        </a-form-model>
      </a-row>
      <a-row type="flex" justify="end">
        <a-button @click="query" type="primary">查询</a-button>
        <a-button @click="queryReset" class="p-input-left-5">重置</a-button>
      </a-row>
    </div>
    <a-tabs v-model="selectTabKey" @change="query" type="card">
      <a-tab-pane key="1" tab="全部"></a-tab-pane>
      <a-tab-pane key="2" tab="销售中"></a-tab-pane>
      <a-tab-pane key="3" tab="已售罄"></a-tab-pane>
      <a-tab-pane key="4" tab="仓库中"></a-tab-pane>
    </a-tabs>
    <a-row type="flex" align="middle">
      <a-button @click="openGroupWindow" class="p-input-right-5">改分组</a-button>
    </a-row>
    <div class="search-result-list">
      <a-table
          rowKey="id"
          :columns="columns"
          :loading="loading"
          :dataSource="data"
          :pagination="pagination"
          :row-selection="{selectedRowKeys:selectedRowKeys,onChange:(rows,value)=>{
                      selectedRowKeys = [...rows]
                      selectedRowValues = [...value]
                    }}"
          :scroll="{x:1400}"
          @change="onChange"
      >
        <template slot="index" slot-scope="val,row,index">
          <a-row type="flex" align="middle">
            <span class="mr5" style="font-size: 13px">{{ val }}</span>
            <list-update-sort-index @complete="(e)=>{
                            row.sortIndex = e.value
                        }" :index="row.sortIndex" :id="row.id"/>
          </a-row>
        </template>
        <template slot="imageOrName" slot-scope="val, row">
          <div :title="row.title" style="display: flex; height: 50px">
            <div style="">
              <img
                  style="width: 50px; height: 50px"
                  :src="row.imageUrl.split(',')[0]"
              />
            </div>
            <div
                style="
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                text-overflow: ellipsis;
                padding-left: 5px;
                font-size: 12px;
                line-height: 25px;
              "
            >
              {{ row.title }}
            </div>
          </div>
        </template>
        <template slot="action" slot-scope="val, row">
          <a-button type="link" class="text-action-btn"
                    @click="$router.push({ path: '/product/update', query: { id: row.id }})">编辑
          </a-button>
          <a-button type="link" class="text-action-btn" @click="onOpenMemberPriceDialog(row.id)">会员价</a-button>
          <a-popconfirm
              title="确认删除该商品？"
              @confirm="onClickDelete(row.id)"
          >
            <a-button type="link" class="text-action-btn">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <update-product-group :visible="groupWindowVisible" :select-row-keys="selectedRowValues" @cancel="()=>{
          groupWindowVisible = false
        }"
                          @confirm="onUpdateBatchGroupConfirm"/>
    <p-member-price-config-dialog @close="memberPriceVisible=false" @complete="onUpdateMemberPriceComplete"
                                  :visible="memberPriceVisible"
                                  :goods-id="goodsId"/>
  </div>
</template>

<script>
import ProductService from '../../service/product.service'
import ProductCategoryAPI from '../../service/product.category.service'
import moment from 'moment'
import util from '../../common/common'
import pattern from '../../common/pattern'
import MemberPriceConfigDialog from '../../components/MemberPriceConfigDialog'
import UpdateProductGroup from './UpdateProductGroup'
import ListUpdateSortIndex from './ProductListPageUpdateSortIndex'

export default {
  name: 'list',
  components: {
    'p-member-price-config-dialog': MemberPriceConfigDialog,
    ListUpdateSortIndex,
    UpdateProductGroup
  },
  data() {
    return {
      queryForm: {
        title: '',
        groupId: '',
        categoryId: [],
        minSalePrice: '',
        maxSalePrice: '',
        minSaleCount: '',
        maxSaleCount: '',
        saleArea:''
      },
      selectTabKey: '1',
      selectedRowKeys: [],
      selectedRowValues: [],
      group: [],
      goodsId: 0,
      categoryOptions: [],
      currentRow: null,
      selectGroup: [],
      memberPriceVisible: false,
      sku: [],
      memberLevel: [],
      sort: null,
      columns: [
        {
          title: '商品名称',
          width: 300,
          scopedSlots: {customRender: 'imageOrName'},
        },
        {
          title: '售价',
          dataIndex: 'minSalePrice',
          sorter: true,
          width: '150px',
          customRender: (value, row) => {
            if (value === row.maxSalePrice) {
              return value.toDecimalString();
            } else {
              return (
                  <div>
                    {value.toDecimalString()}
                    <span class="ml5 mr5">-</span>
                    {row.maxSalePrice.toDecimalString()}
                  </div>
              );
            }
          },
        },
        {
          title: '库存',
          dataIndex: 'inventory',
          sorter: true,
          width: '150px',
        },
        {
          title: '销量',
          dataIndex: 'saleCount',
          width: '150px',
          sorter: true,
          customRender: (value) => {
            if (value === 0) return '-';
            return value;
          },
        },
        {
          title: '序号',
          dataIndex: 'sortIndex',
          width: '150px',
          sorter: true,
          scopedSlots: {customRender: 'index'},
        },
        {
          title: '商品状态',
          dataIndex: 'saleStatus',
          width: '150px',
          customRender: (value, row) => {
            if (row.saleStatus === 2) {
              return '已售罄'
            }
            if (row.productStatus === 1) {
              return '销售中'
            } else {
              return '仓库中'
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          customRender(value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: {customRender: 'action'},
        },
      ],
      data: [],
      loading: false,
      groupWindowVisible: false,
      pagination: {
        pageSizeOptions: ['15', '35', '50'],
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 15,
        defaultPageSize: 15,
        current: 1,
        showTotal: (total) => {
          let pageNum = Math.ceil(total / this.pagination.pageSize);
          return '共 ' + pageNum + '页' + '/' + total + ' 条数据';
        },
      },
    };
  },
  created() {
    this.query();
    this.queryProductGroup();
    this.queryCategoryTree([{value: '-1'}]);
  },
  methods: {
    query() {
      if (this.queryRequire() === false) return;
      this.loading = true
      ProductService.list(this.queryCombine()).then((res) => {
        this.data = res.data.result.list
        this.pagination.total = res.data.result.total
        this.loading = false
      });
    },
    queryReset() {
      this.queryForm.title = util.TextExtend.String.empty;
      this.queryForm.groupId = util.TextExtend.String.empty;
      this.queryForm.saleArea = util.TextExtend.String.empty;
      this.queryForm.minSalePrice = util.TextExtend.String.empty;
      this.queryForm.maxSalePrice = util.TextExtend.String.empty;
      this.queryForm.minSaleCount = util.TextExtend.String.empty;
      this.queryForm.maxSaleCount = util.TextExtend.String.empty;
      this.queryForm.categoryId = [];
    },
    queryProductGroup() {
      ProductService.groupList({pageIndex: 1, pageSize: 100}).then((res) => {
        if (util.isSuccess(res)) {
          this.group = res.data.result.list.map((x) => {
            return {id: x.id.toString(), name: x.name};
          });
        }
      });
    },
    queryCategoryTree(selectNode) {
      console.log(selectNode);
      let prevNode = selectNode[selectNode.length - 1];
      prevNode.loading = true;
      ProductCategoryAPI.getList({pid: prevNode.value}).then((res) => {
        if (util.isSuccess(res)) {
          let nodes = res.data.result.map((x) => {
            return {
              value: x.id.toString(),
              label: x.name,
              isLeaf: false,
            };
          });
          if (this.categoryOptions.length === 0) {
            this.categoryOptions = nodes;
          } else {
            if (nodes.length > 0) {
              prevNode.children = nodes;
            } else {
              prevNode.isLeaf = true;
            }
          }
          prevNode.loading = false;
          this.categoryOptions = [...this.categoryOptions];
        }
      });
    },
    reset() {
      this.queryForm.resetFields();
    },
    onChange(event, filters, sorter) {
      this.pagination.current = event.current;
      this.pagination.pageSize = event.pageSize;
      console.log(sorter)
      if (sorter.hasOwnProperty('order')) {
        this.sort = {
          key: sorter.columnKey,
          order: sorter.order === 'ascend' ? 1 : 2
        }
      } else {
        this.sort = null
      }
      this.query();
    },
    queryRequire() {
      if (
          this.queryForm.minSalePrice.length > 0 &&
          pattern.decimal2.test(this.queryForm.minSalePrice) === false
      ) {
        this.$message.error('请输入正确的价格');
        return false;
      }
      if (
          this.queryForm.maxSalePrice.length > 0 &&
          pattern.decimal2.test(this.queryForm.maxSalePrice) === false
      ) {
        this.$message.error('请输入正确的价格');
        return false;
      }
      if (
          this.queryForm.minSaleCount.length > 0 &&
          pattern.decimal2.test(this.queryForm.minSaleCount) === false
      ) {
        this.$message.error('请输入正确的销量');
        return false;
      }
      if (
          this.queryForm.maxSaleCount.length > 0 &&
          pattern.decimal2.test(this.queryForm.maxSaleCount) === false
      ) {
        this.$message.error('请输入正确的销量');
        return false;
      }
      return true;
    },
    queryCombine() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      if (this.sort !== null) {
        query.sortName = this.sort.key
        query.order = this.sort.order
      }
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'title',
          (x) => x.title.length > 0
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'saleArea',
          (x) => x.saleArea !== undefined && x.saleArea.length > 0
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'groupId',
          (x) => {
            console.log(x)
            return x.groupId !== undefined && x.groupId.length > 0
          }
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'minSalePrice',
          (x) => x.minSalePrice.length > 0 && x.maxSalePrice.length > 0
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'maxSalePrice',
          (x) => x.minSalePrice.length > 0 && x.maxSalePrice.length > 0
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'minSaleCount',
          (x) => x.minSaleCount.length > 0 && x.maxSaleCount.length > 0
      );
      util.ObjectExtend.fieldCopy(
          this.queryForm,
          query,
          'maxSaleCount',
          (x) => x.minSaleCount.length > 0 && x.maxSaleCount.length > 0
      );
      if (this.queryForm.categoryId.length > 0) {
        query.categoryId = this.queryForm.categoryId[
        this.queryForm.categoryId.length - 1
            ];
      }
      if (this.selectTabKey === '3') {
        query.saleStatus = 2
      }
      if (this.selectTabKey === '2') {
        query.productStatus = 1
      }
      if (this.selectTabKey === '4') {
        query.productStatus = 3
      }
      return query;
    },
    openGroupWindow() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择商品')
        return;
      }
      this.groupWindowVisible = true;
    },
    changeGroupHandler(e) {
      this.group.forEach((x) => {
        if (x.id === e) {
          if (x.check) {
            x.check = false;
          } else {
            x.check = true;
          }
          if (x.defaultCheck === true && x.check === false) {
            x.status = 2;
          } else if (x.defaultCheck === false && x.check === true) {
            x.status = 1;
          }
        }
      });
    },
    onUpdateBatchGroupConfirm() {
      this.selectedRowValues = []
      this.selectedRowKeys = []
      this.groupWindowVisible = false
      this.query()
    },
    onClickDelete(e) {
      ProductService.deleteProduct({id: e}).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('删除成功!');
          this.load();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    onOpenMemberPriceDialog(id) {
      this.goodsId = id
      this.memberPriceVisible = true
    },
    onUpdateProductStatus(row) {
      let updateValue = row.productStatusChecked ? 1 : 2;
      ProductService.updateProductStatus({
        id: row.id,
        productStatus: updateValue,
      }).then((res) => {
        if (res.data.code === 0) {
          row.productStatus = updateValue;
          row.productStatusChecked = row.productStatus === 1;
          let text = row.productStatusChecked ? '上架' : '下架';
          this.$message.success(text + '成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onUpdateMemberPriceComplete() {
      this.memberPriceVisible = false
      this.getDataSource()
    }
  },
};
</script>

<style scoped>
</style>
