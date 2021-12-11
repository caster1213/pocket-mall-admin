<template>
    <tr class="sku-list-option">
        <td v-for="(sku,index) in fields.skuValues" :key="index">{{sku.skuValue}}</td>
        <td>
            <div>
                <div class="has-upload">
                    <a-icon v-if="image.value.length === 0" @click="image.materialVisible = true" class="btn"
                            type="plus" />
                    <div v-if="image.value.length>0" style="height: 40px;width: 40px; position: relative;">
                        <img :src="image.value" style="width: 100%; height: 100%; object-fit: fill" />
                        <div @click="image.value = ''" style="position: absolute;top:-12px;right: -10px">
                            <a-icon theme="filled" type="close-circle" />
                        </div>
                    </div>
                </div>
            </div>
        </td>
        <td>
            <div :class="{'has-error':code.isError}">
                <a-input v-model="code.value" style="min-width: 180px" />
            </div>
        </td>
        <td>
            <div :class="{'has-error':price.isError}">
                <a-input v-model="price.value" @change="price.validate()" style="min-width: 80px" />
                <a-row v-if="price.isError">
                    <span style="font-size: 12px">{{price.message}}</span>
                </a-row>
            </div>
        </td>
        <td>
            <div :class="{'has-error':marketPrice.isError}">
                <a-input v-model="marketPrice.value" @change="marketPrice.validate()" style="min-width: 80px" />
                <a-row v-if="marketPrice.isError">
                    <span style="font-size: 12px">{{marketPrice.message}}</span>
                </a-row>
            </div>
        </td>
        <td>
            <div :class="{'has-error':costPrice.isError}">
                <a-input v-model="costPrice.value" @change="costPrice.validate()" class="font-size-12"
                         style="min-width: 80px" />
                <a-row v-if="costPrice.isError">
                    <span style="font-size: 12px">{{costPrice.message}}</span>
                </a-row>
            </div>
        </td>
        <td>
            <div :class="{'has-error':inventory.isError}">
                <a-input v-model="inventory.value" @change="inventory.validate()" style="min-width: 80px" />
                <a-row v-if="inventory.isError">
                    <span style="font-size: 12px">{{inventory.message}}</span>
                </a-row>
            </div>
        </td>
        <td>
            <div :class="{'has-error':weight.isError}">
                <a-input v-model="weight.value" @change="weight.validate()" style="min-width: 80px" />
                <a-row v-if="weight.isError">
                    <span style="font-size: 12px">{{weight.message}}</span>
                </a-row>
            </div>
        </td>
        <td>
            <div :class="{'has-error':volume.isError}">
                <a-input v-model="volume.value" @change="volume.validate()" style="min-width: 80px" />
                <a-row v-if="volume.isError">
                    <span style="font-size: 12px">{{volume.message}}</span>
                </a-row>
            </div>
        </td>
        <td style="min-width: 40px;color: #2589FF">
            <a @click="clear">清空</a>
        </td>
        <template v-if="image.materialVisible">
            <p-material-upload-modal @confirm="onUploadConfirm" :visible.sync="image.materialVisible" :select-max="1"
                                     :material-type="1" />
        </template>

    </tr>
</template>

<script>
import MaterialUploadModal from '../material/MaterialUploadModal'
import Field from './Model'

export default {
  name: 'SkuPanelListOption',
  components: {
    'p-material-upload-modal': MaterialUploadModal
  },
  props: {
    fields: Object
  },
  data() {
    return {
      image: {
        materialVisible: false,
        value: ''
      },
      code: new Field(),
      price: new Field(),
      marketPrice: new Field(),
      costPrice: new Field(),
      inventory: new Field(),
      weight: new Field(),
      volume: new Field()
    }
  },
  watch: {
    fields() {
      this.initValue()
    }
  },
  created() {
    this.price.rules.push({type: 'required', message: '请输入价格'})
    this.price.rules.push({
      type: 'pattern',
      pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
      message: '请填写正确的数字,小数点最多保留2位'
    })
    this.marketPrice.rules.push({
      type: 'pattern',
      pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
      message: '请填写正确的数字,小数点最多保留2位'
    })
    this.costPrice.rules.push({
      type: 'pattern',
      pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
      message: '请填写正确的数字,小数点最多保留2位'
    })
    this.inventory.rules.push({type: 'required', message: '请输入库存'})
    this.inventory.rules.push({type: 'pattern', pattern: /^(0|[1-9][0-9]*)$/, message: '请填写正确的数字'})
    this.weight.rules.push({
      type: 'pattern',
      pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
      message: '请填写正确的数字,小数点最多保留2位'
    })
    this.volume.rules.push({
      type: 'pattern',
      pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
      message: '请填写正确的数字,小数点最多保留2位'
    })
    this.initValue()
  },
  methods: {
    initValue() {
      this.image.value = this.fields.image
      this.code.value = this.fields.code
      this.price.value = this.fields.salePrice.toDecimalString()
      this.marketPrice.value = this.fields.marketPrice.toDecimalString()
      this.costPrice.value = this.fields.costPrice.toDecimalString()
      this.inventory.value = this.fields.inventory.toString()
      this.weight.value = this.fields.weight
      this.volume.value = this.fields.volume
    },
    clear() {
      this.image.value = ''
      this.code.value = ''
      this.price.value = ''
      this.marketPrice.value = ''
      this.costPrice.value = ''
      this.inventory.value = ''
      this.weight.value = ''
      this.volume.value = ''
    },
    onUploadConfirm(e) {
      if (e.length > 0) {
        this.image.value = e[0].url
      }
    }
  }
}
</script>

<style scoped>
    .sku-list-option td {
        border: 1px solid #ededef;
        padding: 10px 15px;
        vertical-align: middle;
        white-space: nowrap;
        position: relative;
        font-size: 12px;
    }

    .sku-list-option td .has-error {
        border: #f5222d;
        color: #f5222d;
    }

    .sku-list-option td .has-error input {
        color: #f5222d;
    }

    .has-upload {
        width: 40px;
        height: 40px;
        border: 1px dashed #E3E2E5;
        text-align: center;
    }

    .has-upload .btn {
        font-size: 15px;
        line-height: 40px;
        font-weight: 500;
    }

    .has-upload:hover {
        cursor: pointer;
    }
</style>
