<template>
  <page :loading="loading">
    <a-form-model style="margin-bottom: 100px" :label-col="{md:{span:3},xl:{span:2}}" :wrapper-col="{span:15}">
      <nav-title title="基础信息" type="line" class="mb15"/>
      <a-form-model-item label="选择商品">
        <a-radio-group v-if="isEdit === false" v-model="exchangeType" class="radio-list" style="margin-top: 8px">
          <a-radio :disabled="true" :value="2">
            <span>优惠券</span>
          </a-radio>
          <a-radio :value="1">
            <span>商品</span>
            <a-button @click="goodsSelectPickerVisible = true" type="link" class="font-size-13">选择商品</a-button>
          </a-radio>
        </a-radio-group>
        <div>
          <div class="mt10">
            <a-table row-key="id" :columns="selectProductColumns" :data-source="goodsSelectRows" :pagination="false"/>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="有效期">
        <a-range-picker :ranges="dataPickerDate" v-model="selectDate" :show-time="true"/>
      </a-form-model-item>
      <a-form-model-item label="购买限制">
        <a-checkbox :checked="isOriginal" @change="onOriginalChange">该商品不允许直接购买</a-checkbox>
      </a-form-model-item>
      <nav-title title="兑换条件" type="line" class="mb15"/>
      <a-form-model-item label="兑换价">
        <a-radio-group style="margin-top: 8px" default-value="custom" class="radio-list">
          <a-radio :disabled="true" value="single">统一兑换价</a-radio>
          <a-radio value="custom">使用自定义设置</a-radio>
        </a-radio-group>
        <div class="mt10">
          <a-table row-key="skuId" :columns="exchangePriceColumns" :data-source="goodsSkuRows"
                   :row-selection="{selectedRowKeys:selectedSkuRowKeys,onChange:onSelectSkuRowKeyChange}"
                   :pagination="false"/>
        </div>
      </a-form-model-item>
      <a-form-model-item label="兑换限制">
        <a-input v-model="exchangeLimitCount" style="width: 80px"/>
        <span class="ml10">件/人</span>
      </a-form-model-item>
    </a-form-model>
    <p-footer>
      <template #content>
        <a-button class="p-input-right">取消</a-button>
        <a-button :loading="loadingBtn" @click="onSubmit" type="primary">保存</a-button>
      </template>
    </p-footer>
    <goods-select-pricker title="选择商品" @close="goodsSelectPickerVisible = false" :is-single-select="true"
                          @confirm="onGoodsPickerChange"
                          :select-type="goodsSelectPickerType"
                          :is-show-product-group="false"
                          :is-activity-filter="true"
                          :current-activity-type="2"
                          :visible="goodsSelectPickerVisible" :select-goods-rows="goodsSelectRows"/>
  </page>
</template>

<script>
import Page from '../../../components/Page'
import NavTitle from '../../../components/Title'
import GoodsSelectPricker from "../../../components/GoodsSelectPricker"
import ProductService from '../../../service/product.service'
import {Field} from '../../../common/field'
import pattern from "../../../common/pattern"
import PointExchangeActivityService from '../../../service/point.exchange.activity'
import constant from "../../../common/constant"
import moment from "moment"

export default {
  name: "AddPointExchangeActivity",
  components: {
    Page,
    NavTitle,
    GoodsSelectPricker
  },
  data() {
    return {
      loading: false,
      isEdit: false,
      loadingBtn: false,
      dataPickerDate: {
        '3天': [moment(), moment().add(3, 'days')],
        '7天': [moment(), moment().add(7, 'days')],
        '1个月': [moment(), moment().add(1, 'months')],
        '3个月': [moment(), moment().add(3, 'months')],
        '半年': [moment(), moment().add(6, 'months')],
        '一年': [moment(), moment().add(12, 'months')],
      },
      goodsSelectPickerVisible: false,
      goodsSelectPickerType: 'goods',
      isOriginal: false,
      exchangeType: 1,
      selectDate: [],
      exchangeLimitCount: '',
      selectedSkuRowKeys: [],
      selectedSkuRows: [],
      goodsSelectRows: [],
      goodsSkuRows: [],
      selectProductColumns: [{
        title: '商品',
        customRender: (value, row) => {
          if (this.goodsSelectPickerType === 'goods') {
            return this.productColumnRender(value, row)
          } else {
            return row.name
          }
        }
      }, {
        title: '操作',
        customRender: (value, row) => {
          if (this.isEdit) {
            return <span></span>
          }
          return <a-button onClick={() => {
            this.onDeleteSelectRow(row)
          }} class="text-action-btn" type="link">删除</a-button>
        }
      }],
      exchangePriceColumns: [{
        title: '规格',
        customRender: (value, row) => {
          if (row.attrValue.length === 0) {
            return '规格1'
          }
          let kv = []
          for (let ele of row.attrValue) {
            let span = <span class="mr5">{ele.skuAttrName}:{ele.skuAttrValue}</span>
            kv.push(span)
          }
          return <div>
            {kv}
          </div>
        }
      }, {
        title: '库存',
        dataIndex: 'inventory'
      }, {
        title: '价格',
        dataIndex: 'salePrice'
      }, {
        title: '可兑换数量',
        customRender: (val, row, index) => {
          let value = row.exchangeCount.value.toString()
          let msg = row.exchangeCount.errorMessage
          let hasError = row.exchangeCount.hasError
          return (<div class={{'has-error': hasError}}>
            <a-input style="width:80px;" onChange={(e) => {
              this.onUpdateSkuExchangeCount(index, e)
            }} value={value}/>
            <div v-show={hasError} class="input-error">{msg}</div>
          </div>)
        }
      }, {
        title: '兑换价',
        width: 350,
        customRender: (val, row, index) => {
          return <a-row type="flex" align="middle">
            <div class={{'has-error': row.exchangePoint.hasError}}>
              <a-input value={row.exchangePoint.value} addon-after="积分" style="width:100px" onChange={(e) => {
                this.onUpdateSkuExchangePrice(index, e, 'exchangePoint')
              }}/>
              <div v-show={row.exchangePoint.hasError} class="input-error">{row.exchangePoint.errorMessage}</div>
            </div>
            <span class="ml5 mr5">+</span>
            <div class={{'has-error': row.exchangePrice.hasError}}>
              <a-input value={row.exchangePrice.value} addon-after="元" style="width:100px" onChange={(e) => {
                this.onUpdateSkuExchangePrice(index, e, 'exchangePrice')
              }}/>
              <div v-show={row.exchangePrice.hasError} class="input-error">{row.exchangePrice.errorMessage}</div>
            </div>
          </a-row>
        }
      }],
      source: null,
    }
  },
  created() {
    if (this.$route.query.hasOwnProperty('id')) {
      this.load()
    }
  },
  methods: {
    load() {
      this.loading = true
      this.isEdit = this.$route.query.hasOwnProperty('id')
      PointExchangeActivityService.get({id: this.$route.query.id}).then(res => {
        this.loading = false
        let model = res.data.result.model
        let value = res.data.result.value
        this.source = model
        this.goodsSelectPickerType = model.productRange === 1 ? 'goods' : 'group'
        this.selectDate.push(moment(model.startDate))
        this.selectDate.push(moment(model.endDate))
        this.isOriginal = model.isOriginalPriceBuy
        this.goodsSelectRowsRender(model.productRange === 1, value, model.pointExchangeProductConfigs)
        this.exchangeLimitCount = model.exchangeLimitCount === -1 ? '' : model.exchangeLimitCount
      })
    },
    goodsSelectRowsRender(isProduct, value, options) {
      if (isProduct) {
        this.goodsSelectRows.push({
          id: value.id,
          title: value.title,
          imageUrl: value.imageUrl,
          minSalePrice: value.minPrice
        })
        this.goodsSkuRows = value.skuPrices.map(ele => {
          let option = options.find(x => x.productSkuId === ele.id)

          let row = {
            skuId: ele.id,
            attrValue: ele.skuAttributeMappers,
            salePrice: ele.salePrice,
            inventory: ele.inventory,
            exchangeCount: new Field("exchangeCount", "", "number", "", option === undefined ? 0 : option.count, [{
              pattern: pattern.decimal0,
              message: '请输入正确的数字'
            }, {required: true, message: '请输入兑换数量'}]),
            exchangePrice: new Field("exchangePrice", "", "number", "", option === undefined ? 0 : option.price, [{
              pattern: pattern.decimal2,
              message: '请输入正确的数字'
            }, {required: true, message: '请填写积分'}]),
            exchangePoint: new Field("exchangePoint", "", "number", "", option === undefined ? 0 : option.point, [{
              pattern: pattern.decimal2,
              message: '请输入正确的数字'
            }, {required: true, message: '请填写价格'}])
          }
          if (option !== undefined) {
            this.selectedSkuRowKeys.push(ele.id)
            this.selectedSkuRows.push(row)
            row.id = option.id
          }
          return row
        })
      }
    },
    onGoodsPickerChange(rows, selectType) {
      this.goodsSelectPickerType = selectType
      this.goodsSelectPickerVisible = false
      this.goodsSelectRows = rows
      ProductService.get({id: rows[0].id}).then(res => {
        this.goodsSkuRows = res.data.result.skuPrices.map(ele => {
          return {
            skuId: ele.id,
            attrValue: ele.skuAttributeMappers,
            salePrice: ele.salePrice,
            inventory: ele.inventory,
            exchangeCount: new Field("exchangeCount", "", "number", "", 0, [{
              pattern: pattern.decimal0,
              message: '请输入正确的数字'
            }, {required: true, message: '请输入兑换数量'}]),
            exchangePrice: new Field("exchangePrice", "", "number", "", 0, [{
              pattern: pattern.decimal2,
              message: '请输入正确的数字'
            }, {required: true, message: '请填写积分'}]),
            exchangePoint: new Field("exchangePoint", "", "number", "", 0, [{
              pattern: pattern.decimal2,
              message: '请输入正确的数字'
            }, {required: true, message: '请填写价格'}])
          }
        })
      })
    },
    productColumnRender(value, row) {
      let imageUrl = row.imageUrl.split(',')[0]
      return (<a-row type="flex">
        <div>
          <img width="60px" height="60px" src={imageUrl}/>
        </div>
        <div style="display: flex;flex-direction: column;justify-content: space-around;" class="ml10">
          <div>
            <a class="line1">{row.title}</a>
          </div>
          <span style="font-weight:700;color:#ed6a0c">¥{value.minSalePrice}</span>
        </div>
      </a-row>)
    },
    onOriginalChange(e) {
      this.isOriginal = e.target.checked
    },
    onDeleteSelectRow() {
      this.goodsSelectRows = []
      this.goodsSkuRows = []
    },
    onSelectSkuRowKeyChange(selectedRowKeys, selectedRows) {
      this.selectedSkuRowKeys = [...selectedRowKeys]
      this.selectedSkuRows = [...selectedRows]
    },
    onUpdateSkuExchangeCount(index, value) {
      let newRows = [...this.goodsSkuRows]
      newRows[index].exchangeCount.value = value.target.value
      newRows[index].exchangeCount.validate()
      this.goodsSkuRows = newRows
    },
    onUpdateSkuExchangePrice(index, value, key) {
      let newRows = [...this.goodsSkuRows]
      if (key === 'exchangePrice') {
        newRows[index].exchangePrice.value = value.target.value
        newRows[index].exchangePrice.validate()
      } else {
        newRows[index].exchangePoint.value = value.target.value
        newRows[index].exchangePoint.validate()
      }
      this.goodsSkuRows = newRows
    },
    onSubmit() {
      if (this.goodsSelectRows.length === 0) {
        this.$message.warn('请选择要兑换的商品')
        return
      }
      if (this.selectDate.length === 0) {
        this.$message.warn('请填写兑换的有效期')
        return
      }
      if (this.selectedSkuRows.length === 0) {
        this.$message.warn('请配置规格的兑换价格')
        return
      }
      for (let ele of this.selectedSkuRows) {
        ele.exchangePrice.validate()
        ele.exchangeCount.validate()
        ele.exchangePoint.validate()
        if (ele.exchangePrice.hasError || ele.exchangePoint.hasError || ele.exchangeCount.hasError) {
          return
        }
      }
      let args = {
        exchangeType: this.exchangeType,
        productId: this.goodsSelectRows[0].id,
        startDate: this.selectDate[0].format("YYYY-MM-DD HH:mm:ss"),
        endDate: this.selectDate[1].format("YYYY-MM-DD HH:mm:ss"),
        isOriginalPriceBuy: this.isOriginal,
        productRange: this.goodsSelectPickerType === 'goods' ? 1 : 2,
        exchangeLimitCount: this.exchangeLimitCount.length === 0 ? -1 : this.exchangeLimitCount,
        pointExchangeProductConfigs: this.selectedSkuRows.map(ele => {
          return {
            id: ele.id,
            productSkuId: ele.skuId,
            productId: this.goodsSelectRows[0].id,
            count: ele.exchangeCount.value,
            price: ele.exchangePrice.value,
            point: ele.exchangePoint.value
          }
        })
      }
      if (this.isEdit) {
        args.id = this.$route.query.id
        let delOptions = []
        for (let option of this.source.pointExchangeProductConfigs) {
          if (args.pointExchangeProductConfigs.findIndex(x => x.id === option.id) === -1) {
            delOptions.push(option)
          }
        }
        delOptions.forEach(x => {
          x.isDelete = true
          args.pointExchangeProductConfigs.push(x)
        })
      }
      this.loadingBtn = true
      if (this.isEdit) {
        PointExchangeActivityService.update(args).then(res => {
          this.loadingBtn = false
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success("保存成功")
            this.$router.push('/marketing/point')
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        PointExchangeActivityService.add(args).then(res => {
          this.loadingBtn = false
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success("保存成功")
            this.$router.push('/marketing/point')
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.input-error {
  color: #f5222d;
  font-size: 12px;
  margin-top: 5px;
}
</style>