<template>
    <div>
        <p-sku-attr-option v-for="attr in skuAttrSelect" :key="attr.id" :sku="attr" @clear="onClearSkuAttrValue"
                           @change="onChangeSkuValue" />
        <p-sku-add-attr v-model="skuAttrList" @select="onSelectSkuAttr" @save="onSaveSkuAttr" />
        <p-sku-list ref="skuList" :options="skuRows" :columns="columns" />
    </div>
</template>

<script>
import SkuPanelAddAttr from './SkuPanelAddAttr'
import SkuPanelAttrOption from './SkuPanelAttrOption'
import SkuPanelList from './SkuPanelList'
import ProductServiceAPI from '../../service/product.service'
import util from '../../common/common'
import CryptoJS from 'crypto-js'


export default {
  name: 'SkuSelect',
  components: {
    'p-sku-add-attr': SkuPanelAddAttr,
    'p-sku-attr-option': SkuPanelAttrOption,
    'p-sku-list': SkuPanelList
  },
  props: {
    categoryId: Number,
    value: Array
  },
  data() {
    return {
      skuAttrList: [],
      skuAttrSelect: [],
      columns: [],
      cells: [],
      skuRows: []
    }
  },
  created() {
    this.getSkuAttr()
    this.initSkuList()
  },
  watch: {
    categoryId() {
      this.getSkuAttr()
    }
  },
  methods: {
    initSkuList() {
      for (let row of this.value) {
        let r = {
          id: row.id,
          image: row.image,
          salePrice: row.salePrice,
          costPrice: row.costPrice,
          marketPrice: row.marketPrice,
          code: row.code,
          inventory: row.inventory,
          weight: row.weight,
          volume: row.volume,
          skuValues: [],
          hash: ''
        }
        for (let sku of row.skuList) {
          r.skuValues.push(sku)
          if (this.skuAttrSelect.findIndex(x => x.skuId === sku.skuId) === -1) {
            this.onSelectSkuAttr({
              skuId: sku.skuId,
              skuName: sku.skuName,
              skuValues: [{
                skuValueId: sku.skuValueId,
                skuValue: sku.skuValue
              }]
            })
          } else {
            this.skuAttrSelect.find(x => x.skuId === sku.skuId).skuValues.push({
              skuValueId: sku.skuValueId,
              skuValue: sku.skuValue
            })
          }
          sku.selected = true
          this.appendCell(sku)
        }
        r.hash = CryptoJS.MD5(r.skuValues.map(x => x.skuValue).join()).toString()
        this.skuRows.push(r)
      }
    },
    getFields() {
      return this.$refs.skuList.getFields()
    },
    getSkuAttr() {
      ProductServiceAPI.getProductSkuAttributes({
        id: this.categoryId
      }).then(res => {
        if (util.isSuccess(res) === false) {
          return
        }
        for (const field in res.data.result) {
          this.skuAttrList.push({
            skuName: res.data.result[field],
            skuId: field,
          })
        }
      })
    },
    onSelectSkuAttr(select) {
      if (this.skuAttrSelect.filter(x => x.skuId === select.skuId).length > 0) {
        this.$message.error('无法添加相同的规格名称')
        return
      }
      this.skuAttrSelect.push(select)
      this.columns = this.skuAttrSelect.map(x => x.skuName)
    },
    onSaveSkuAttr(value) {
      ProductServiceAPI.addSkuAttributeName({
        productCategoryId: this.categoryId,
        name: value
      }).then(res => {
        if (util.isSuccess(res)) {
          this.skuAttrList.push({
            skuId: res.data.result.id.toString(),
            skuName: value
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onClearSkuAttrValue(e) {
      let index = this.skuAttrSelect.findIndex(x => x.skuId === e.toString())
      this.skuAttrSelect.splice(index, 1)
      this.columns = this.skuAttrSelect.map(x => x.skuName)
    },
    onChangeSkuValue(e) {
      this.appendCell(e)
      if (this.cells.length > 0) {
        this.appendSkuRow()
      }
      this.$emit('change', this.skuAttrSelect)
    },
    appendCell(cell) {
      let index = this.skuAttrSelect.findIndex(x => x.skuId === cell.skuId.toString())
      if (cell.selected) {

        if (this.cells[index] === undefined) {
          this.cells[index] = [cell]
        } else {
          if (this.cells[index].findIndex(x => x.skuId === cell.skuId.toString() && x.skuValueId === cell.skuValueId) === -1) {
            this.cells[index].push(cell)
          }
        }
      } else {
        let i = this.cells[index].findIndex(ele => ele.skuValueId === cell.skuValueId)
        this.cells[index].splice(i, 1)
      }
      //this.cells.splice(index, 1, this.cells[index])
    },
    appendSkuRow() {
      let list = []
      let append = (index, prev) => {
        let lastFlag = this.cells.length - 1 === index
        for (let sku of this.cells[index]) {
          prev[index] = sku
          if (lastFlag) {
            list.push(prev.map(x => x))
          } else {
            append(index + 1, prev)
          }
        }
      }
      append(0, [])
      let rows = []
      for (let str of list) {
        let hash = CryptoJS.MD5(str.map(x => x.skuValue).join()).toString()
        let index = this.skuRows.findIndex(x => x.hash === hash)
        if (index > -1) {
          rows.push(this.skuRows[index])
        } else {
          rows.push({
            id: undefined,
            image: '',
            salePrice: '',
            costPrice: '',
            marketPrice: '',
            code: '',
            weight: '',
            volume: '',
            inventory: '',
            skuValues: str
          })
        }
      }
      this.skuRows = rows
    },
    validate() {
      return this.$refs.skuList.validate()
    }
  }
}
</script>

<style scoped>
    .sku-panel {
    }
</style>
