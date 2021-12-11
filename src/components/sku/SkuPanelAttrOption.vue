<template>
    <div class="sku-box">
        <a-row type="flex" justify="space-between" class="sku-row">
            <div>{{sku.skuName}}</div>
            <div>
                <a @click="onClear">移除规格</a>
            </div>
        </a-row>
        <a-row type="flex">
            <a-col v-for="value in list" :key="value.skuValueId" class="sku-val-cell">
                <a-row type="flex" justify="space-between">
                    <a-col>{{value.skuValue}}</a-col>
                    <a-col @click="onDeleted(value)">
                        <a-icon type="close" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <p-sku-attr-dialog :sku-id="skuId" :select-sku="list" @change="onChance" />
    </div>
</template>

<script>
import SkuPanelAddAttrValueDialog from './SkuPanelAddAttrValueDialog'

export default {
  name: 'SkuPanelAttrOption',
  components: {
    'p-sku-attr-dialog': SkuPanelAddAttrValueDialog
  },
  props: {
    sku: Object,
  },
  data() {
    return {
      skuId: parseInt(this.sku.skuId),
      list: []
    }
  },
  created() {
    this.initSkuValue()
  },
  methods: {
    initSkuValue() {
      if (this.sku.skuValues === undefined) {
        this.sku.skuValues = []
      }
      for (let v of this.sku.skuValues) {
        if (this.list.findIndex(x => x.skuValueId === v.skuValueId) > -1) continue
        this.list.push({
          skuId: this.sku.skuId,
          skuValueId: v.skuValueId,
          skuValue: v.skuValue,
          selected: true
        })
      }
    },
    onChance(e) {
      if (e.selected) {
        this.list.push(e)
      } else {
        this.del(e)
      }
      this.$emit('change', {skuId: this.skuId, skuValueId: e.skuValueId, skuValue: e.skuValue, selected: e.selected})
    },
    onDeleted(e) {
      this.del(e)
      this.$emit('change', {skuId: this.skuId, skuValueId: e.skuValueId, skuValue: e.skuValue, selected: false})
    },
    del(ele) {
      let i = this.list.findIndex(x => x.id === ele.id)
      this.list.splice(i, 1)
    },
    onClear() {
      if (this.list.length > 0) {
        this.$message.warning('请先移除下列规格值')
        return
      }
      this.$emit('clear', this.skuId)
    }
  }
}
</script>

<style scoped>
    .sku-box {
        margin-bottom: 15px;
    }

    .sku-row {
        background-color: #f8f8f8;
        padding: 5px 10px 5px 10px;
        font-size: 12px;
    }

    .sku-val-cell {
        border: 1px solid #DDDDDD;
        position: relative;
        height: 30px;
        min-width: 100px;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 20px;
        margin-top: 10px;
    }

    .sku-val-cell:hover {
        cursor: pointer;
        border: 1px solid #40a9ff;
    }
</style>
