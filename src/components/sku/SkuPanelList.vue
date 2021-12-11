<template>
    <div v-show="options.length>0" class="sku-table-box">
        <table class="sku-table">
            <thead>
            <tr>
                <th v-for="col in columns" :key="col">{{col}}</th>
                <th>规格图片</th>
                <th>商家编码</th>
                <th>
                    <span class="require">销售价(元)
                        <span class="symbol">*</span>
                    </span>
                </th>
                <th>市场价(元)</th>
                <th>成本价(元)</th>
                <th>
                    <span class="require">库存
                        <span class="symbol">*</span>
                    </span>
                </th>
                <th>重量(kg)</th>
                <th>体积(m³)</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
                <p-sku-list-option ref="skuOption" v-for="(option,index) in options" :fields="option" :key="index"/>
            </tbody>
            <tfoot>
            <tr>
                <td :colspan="colspan">
                    <span class="font-size-12">批量设置：</span>
                    <span v-if="bulkIsShow === false" class="font-size-12">
                        <a @click="onOpenBulk('price')" class="mr5">价格</a>
                        <a @click="onOpenBulk('marketPrice')" class="mr5">划线价</a>
                        <a @click="onOpenBulk('costPrice')" class="mr5">成本价</a>
                        <a @click="onOpenBulk('inventory')" class="mr5">库存</a>
                        <a @click="onOpenBulk('weight')" class="mr5">重量</a>
                        <a @click="onOpenBulk('volume')" class="mr5">体积</a>
                    </span>
                    <span v-else class="font-size-12">
                        <a-input v-model="bulkValue" style="width: 120px;height: 30px" class="p-input-right"/>
                        <a @click="onSaveBulk" class="mr5">保存</a>
                        <a @click="()=>{ bulkIsShow = false}">取消</a>
                    </span>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import SkuPanelListOption from "./SkuPanelListOption"

export default {
    name: "SkuPanelList",
    components: {
        'p-sku-list-option': SkuPanelListOption
    },
    props: {
        columns: Array,
        options: Array
    },
    data() {
        return {
            bulkIsShow: false,
            bulkName: '',
            bulkValue: ''
        }
    },
    computed: {
        colspan() {
            return this.columns.length + 10
        }
    },
    methods: {
        validate() {
            if (this.$refs.skuOption === undefined) {
                return true
            }
            for (const option of this.$refs.skuOption) {
                option.price.validate()
                option.marketPrice.validate()
                option.costPrice.validate()
                option.inventory.validate()
                option.weight.validate()
                option.volume.validate()
            }
            let errorCount = 0
            errorCount += this.$refs.skuOption.filter(x => x.price.isError).length
            errorCount += this.$refs.skuOption.filter(x => x.marketPrice.isError).length
            errorCount += this.$refs.skuOption.filter(x => x.costPrice.isError).length
            errorCount += this.$refs.skuOption.filter(x => x.inventory.isError).length
            errorCount += this.$refs.skuOption.filter(x => x.weight.isError).length
            errorCount += this.$refs.skuOption.filter(x => x.volume.isError).length
            return errorCount === 0
        },
        onOpenBulk(e) {
            this.bulkIsShow = true
            this.bulkName = e
        },
        onSaveBulk() {
            if (this.bulkName === 'inventory') {
                if (/^(0|[1-9][0-9]*)$/.test(this.bulkValue) === false) {
                    this.$message.error('请输入正确的数字')
                    return
                }
            } else {
                if (/^([0-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.bulkValue) === false) {
                    this.$message.error('请输入正确的数字')
                    return
                }
                if (this.bulkValue === '0') {
                    this.$message.error('请输入正确的数字')
                    return
                }
            }
            for (let option of this.$refs.skuOption) {
                if (this.bulkName === 'inventory') {
                    option[this.bulkName].value = this.bulkValue
                } else {
                    option[this.bulkName].value = this.bulkValue.toDecimalString()
                }

            }
            this.bulkValue = ''
            this.bulkIsShow = false
        },
        getFields() {
            return this.$refs.skuOption.map(x => {
                let toDecimal = (input) => {
                    if (input.length === 0) {
                        return 0
                    } else {
                        return parseFloat(input)
                    }
                }
                return {
                    id: x.fields.id,
                    image: x.image.value,
                    salePrice: toDecimal(x.price.value),
                    costPrice: toDecimal(x.costPrice.value),
                    marketPrice: toDecimal(x.marketPrice.value),
                    code: x.code.value,
                    weight: toDecimal(x.weight.value),
                    volume: toDecimal(x.volume.value),
                    inventory: toDecimal(x.inventory.value),
                    skuValues: x.fields.skuValues
                }
            })
        }
    }
}
</script>

<style scoped>
    .sku-table-box {
        margin-top: 25px;
        overflow-x: auto;
    }

    .sku-table {
        border: 1px solid #DDDDDD;
        border-radius: 5px;
        box-shadow: 0 0 4px 0 rgba(200, 200, 200, 0.5);
        margin-bottom: 25px;
    }

    .sku-table tr th {
        padding: 8px 15px;
        border: 1px solid #ededef;
        text-align: center;
        font-size: 12px;
        font-weight: normal;
        white-space: nowrap;
    }

    .sku-table .require {
        position: relative;
    }

    .sku-table .require .symbol {
        position: absolute;
        color: red;
        padding-left: 3px;
    }

    .sku-table tfoot tr td {
        padding: 8px 15px;
        border: 1px solid #ededef;
    }
</style>
