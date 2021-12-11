<template>
    <a-modal width="840px" title="自定义会员价" :confirm-loading="btnLoading" @ok="onSubmit" @cancel="$emit('close')"
             @close="$emit('close')"
             :visible="modalVisible">
        <div>
            <span class="mr10">商品名称</span>
            <span>MacBookPro 15.6寸</span>
        </div>
        <div class="mt10 mb20">
            <span class="mr10">优惠方式</span>
            <a-radio-group @change="onMemberPriceTypeChange" v-model="discountType">
                <a-radio :value="1">打折</a-radio>
                <a-radio :value="2">减价</a-radio>
                <a-radio :value="3">指定价格</a-radio>
            </a-radio-group>
        </div>
        <div>
            <a-table row-key="id" :loading="loading" :data-source="rows" :columns="columns" :pagination="false"
                     :scroll="{y:500,x:1000}">
                <template v-for="col in columns" :slot="col.dataIndex">
                    <span class="mr5">{{col.name}}</span>
                    <a-popover v-model="col.isEdit" trigger="click">
                        <template slot="content">
                            <a-row>批量修改本列</a-row>
                            <a-row class="mt10 mb10">
                                <a-input v-model="col.value" style="width: 140px"
                                         :addon-after="map.get(discountType).uint" />
                            </a-row>
                            <a-row>
                                <a-button @click="col.isEdit = false" class="mr10">取消</a-button>
                                <a-button @click="onUpdateBatchCol(col)" type="primary">确认</a-button>
                            </a-row>
                        </template>
                        <a-icon style="cursor: pointer" type="edit" />
                    </a-popover>
                </template>
            </a-table>
        </div>
    </a-modal>
</template>

<script>
import constant from '../common/constant'
import pattern from '../common/pattern'
import {Field} from '../common/field'
import ProductService from '../service/product.service'

export default {
  name: 'MemberPriceConfigDialog',
  props: {
    goodsId: Number,
    visible: Boolean
  },
  data() {
    return {
      modalVisible: this.visible,
      discountType: 1,
      map: new Map(),
      goodsSku: [],
      memberLevel: [],
      loading: false,
      btnLoading: false,
      columns: [],
      rows: []
    }
  },
  watch: {
    visible: function (newValue) {
      this.modalVisible = newValue
      if (newValue) {
        this.loading = true
        ProductService.getMemberPrice({id: this.goodsId}).then(res => {
          this.goodsSku = res.data.result.sku
          this.memberLevel = res.data.result.levels
          this.createColumns()
          this.createRows()
          this.loading = false
        })
      }
    }
  },
  created() {
    this.map.set(constant.memberDiscountType.discount, {uint: '折', key: 'discountValue'})
    this.map.set(constant.memberDiscountType.sub, {uint: '减', key: 'reduceValue'})
    this.map.set(constant.memberDiscountType.target, {uint: '¥', key: 'specifyValue'})
  },
  methods: {
    createColumns() {
      let columns = []
      if (this.goodsSku[0].skuAttr.length > 0) {
        let attrs = this.goodsSku[0].skuAttr
        for (const attr of attrs) {
          columns.push({
            title: attr.attrName,
            dataIndex: 'skuAttrId' + attr.attrId.toString(),
            fixed: 'left',
          })
        }
      }
      columns.push({
        title: '正常售价',
        dataIndex: 'salePrice',
        fixed: 'left',
        customRender: (value) => {
          return '¥ ' + value
        }
      })
      for (const level of this.memberLevel) {
        let key = 'vip' + level.level
        columns.push({
          name: level.name,
          value: '',
          isEdit: false,
          dataIndex: key,
          customRender: (value, row, index) => {
            let inputValue = ''
            let hasError = false
            let msg = ''
            let uint = ''
            if (this.discountType === constant.memberDiscountType.discount) {
              inputValue = value.discountValue.value
              hasError = value.discountValue.hasError
              msg = value.discountValue.errorMessage
              uint = '折'
            } else if (this.discountType === constant.memberDiscountType.sub) {
              inputValue = value.reduceValue.value
              hasError = value.reduceValue.hasError
              msg = value.reduceValue.errorMessage
              uint = '减'

            } else {
              inputValue = value.specifyValue.value
              hasError = value.specifyValue.hasError
              msg = value.specifyValue.errorMessage
              uint = '¥'
            }

            return (<div class={{'has-error': hasError}}>
              <a-input style="width:100px;" onChange={(e) => {
                this.updateRows(index, e, key)
              }} value={inputValue} addon-after={uint} />
              <div v-show={hasError} class="input-error">{msg}</div>
            </div>)
          },
          scopedSlots: {title: key}
        })
      }
      this.columns = columns
    },
    createRows() {
      let rows = []
      for (const sku of this.goodsSku) {
        let row = {}
        let discountRule = [
          {pattern: pattern.decimal0, message: '请输入正确的数字'},
          {
            func(value) {
              if (value.length === 0) {
                return false
              }
              if (parseFloat(value) >= 1 && parseFloat(value) <= 9.9) {
                return false
              } else {
                this.message = '打折范围 1～9.9'
                return true
              }
            }, message: ''
          }
        ]
        let subRule = [{pattern: pattern.decimal0, message: '请输入正确的数字'}, {
          func(value) {
            if (value.length === 0) {
              return false
            }
            if (parseFloat(value) > parseFloat(sku.salePrice)) {
              this.message = `减价金额须小于商品售价(${sku.salePrice}元)`
              return true
            } else {
              return false
            }
          },
          message: ''
        }]
        let targetRule = [{pattern: pattern.decimal0, message: '请输入正确的数字'}, {
          func(value) {
            if (value.length === 0) {
              return false
            }
            if (parseFloat(value) > parseFloat(sku.salePrice)) {
              this.message = `指定金额须小于商品售价(${sku.salePrice}元)`
              return true
            } else {
              return false
            }
          },
          message: ''
        }]
        row['id'] = sku.skuId
        row['salePrice'] = sku.salePrice
        for (const attr of sku.skuAttr) {
          row['skuAttrId' + attr.attrId] = attr.attrValue
        }
        for (const ele of sku.memberPrices) {
          row[`vip${ele.level}`] = {
            discountValue: new Field('discountValue', 0, 'number', '', ele.memberPriceType === constant.memberDiscountType.discount ? ele.value : '', discountRule),
            reduceValue: new Field('reduceValue', 0, 'number', '', ele.memberPriceType === constant.memberDiscountType.sub ? ele.value : '', subRule),
            specifyValue: new Field('specifyValue', 0, 'number', '', ele.memberPriceType === constant.memberDiscountType.target ? ele.value : '', targetRule)
          }
        }
        for (const ele of this.memberLevel) {
          if (row.hasOwnProperty('vip' + ele.level) === false) {
            row[`vip${ele.level}`] = {
              discountValue: new Field('discountValue', 0, 'number', '', '', discountRule),
              reduceValue: new Field('reduceValue', 0, 'number', '', '', subRule),
              specifyValue: new Field('specifyValue', 0, 'number', '', '', targetRule)
            }
          }
        }
        rows.push(row)
      }
      this.rows = rows
    },
    onMemberPriceTypeChange(e) {
      let current = null
      let colNames = this.memberLevel.map(x => 'vip' + x.level)
      let typeNames = [{
        key: 'discountValue',
        value: constant.memberDiscountType.discount
      }, {
        key: 'reduceValue',
        value: constant.memberDiscountType.sub
      }, {
        key: 'specifyValue',
        value: constant.memberDiscountType.target
      }]
      for (const typeName of typeNames) {
        for (const colName of colNames) {
          let len = this.rows.filter(x => x[colName][typeName.key].hasError).length
          if (len > 0) {
            current = typeName
            break
          }
        }
      }
      if (current) {
        this.$message.error('存在不正确的价格，请检查会员价设置')
        this.discountType = current.value
      } else {
        this.discountType = e.target.value
      }

    },
    updateRows(index, e, key) {
      let newRows = [...this.rows]
      if (constant.memberDiscountType.discount === this.discountType) {
        newRows[index][key].discountValue.value = e.target.value
        newRows[index][key].discountValue.validate()
      } else if (constant.memberDiscountType.sub === this.discountType) {
        newRows[index][key].reduceValue.value = e.target.value
        newRows[index][key].reduceValue.validate()
      } else {
        newRows[index][key].specifyValue.value = e.target.value
        newRows[index][key].specifyValue.validate()
      }
      this.rows = newRows
    },
    onUpdateBatchCol(col) {
      console.log(col)
      if (col.value.length === 0) return
      for (let i = 0; i < this.rows.length; i++) {
        this.updateRows(i, {target: {value: col.value}}, col.dataIndex)
      }
      col.isEdit = false
    },
    onSubmit() {
      let updateRows = []
      for (const row of this.rows) {
        for (const ele of this.memberLevel) {
          let field = row['vip' + ele.level][this.map.get(this.discountType).key]
          field.validate()
          if (field.hasError) {
            return
          }
          if (field.value.length > 0) {
            let updateRow = {
              skuId: row.id,
              value: field.value,
              memberPriceType: this.discountType,
              levelId: ele.id
            }
            updateRows.push(updateRow)
          }
        }
      }
      this.btnLoading = true
      ProductService.updateMemberPrice({
        goodsId: this.goodsId,
        goodsMemberPriceConfigs: updateRows
      }).then(res => {
        this.btnLoading = false
        if (res.data.code === constant.serviceCode.success) {
          this.$emit('complete')
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })
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
