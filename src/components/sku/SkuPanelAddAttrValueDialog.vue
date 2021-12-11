<template>
    <a-row type="flex" class="sku-btn-val-add">
        <a @click="onDialogDisplay" class="font-size-12">添加规格值</a>
        <em v-if="isShow" class="sku-btn-arrow"></em>
        <a-row v-if="isShow" class="sku-btn-add-box">
            <a-row class="mb10">
                <a-input-search
                        v-model="inputValue"
                        @search="onSearchSave()"
                        @change="onSearchChange"
                        style="width: 250px"
                        class="font-size-12"
                        placeholder="选择或输入规格值">
                        placeholder="选择或输入规格值">
                    <a-button class="font-size-12" slot="enterButton">
                        添加
                    </a-button>
                </a-input-search>
            </a-row>
            <a-row v-if="loading!==2" class="cell-box">
                <template v-for="(cell,index) in list">
                    <a-row @click.native="onSelected(cell)"
                           :key="cell.skuValueId"
                           :class="{selected:cell.selected}"
                           type="flex"
                           justify="space-between">
                        <span>{{cell.skuValue}}</span>
                        <a-icon class="close ml5" @click.stop="onDeleted(cell)"
                                type="close"/>
                    </a-row>
                </template>
            </a-row>
            <a-row class="loading" justify="center" type="flex">
                <a-col class="text-muted font-size-12" v-if="loading === 1">
                    暂无匹配项，您可新增规格值到列表
                </a-col>
                <a-col v-else-if="loading === 2">
                    <a-spin/>
                </a-col>
                <a-col class="text-muted font-size-12" v-else>
                    已全部加载完毕
                </a-col>
            </a-row>
            <a-row class="cell-box-bottom" justify="end" type="flex">
                <a-col>
                    <a-button @click="onDialogDisplay(1)" class="font-size-12"
                              type="primary">关闭
                    </a-button>
                </a-col>
            </a-row>
        </a-row>
    </a-row>
</template>

<script>
import ProductServiceAPI from '../../service/product.service'
import util from '../../common/common'

export default {
    name: "SkuPanelAddAttrValueDialog",
    props: {
        skuId: Number,
        selectSku: Array
    },
    data() {
        return {
            inputValue: '',
            isShow: false,
            list: [],
            loading: 0,
            timer: -1
        }
    },
    created() {
        this.list = this.selectSku.map(x => {
            return {
                skuValueId: x.skuValueId,
                skuValue: x.skuValue,
                selected: true
            }
        })
        this.getData()
    },
    watch: {
        selectSku(nValue) {
            this.list.forEach(ele => {
                if (nValue.findIndex(x => x.skuValueId === ele.skuValueId) === -1) {
                    ele.selected = false
                }
            })
        }
    },
    methods: {
        getData() {
            ProductServiceAPI.getProductSkuAttributeValue({
                id: this.skuId,
                input: this.inputValue
            }).then(res => {
                if (util.isSuccess(res)) {
                    this.list = []
                    res.data.result.forEach(ele => {
                        let i = {
                            skuValueId: ele.id.toString(),
                            skuValue: ele.value,
                            selected: false
                        }
                        if (this.selectSku.findIndex(x => x.skuValueId === ele.id.toString()) > -1) {
                            i.selected = true
                        }
                        this.list.push(i)
                    })
                    if (this.list.length === 0) {
                        this.loading = 1
                    } else {
                        this.loading = 0
                    }
                }
            })
        },
        onDialogDisplay() {
            this.isShow = !this.isShow
        },
        onSearchSave() {
            if (this.inputValue.length === 0) {
                this.$message.error('请填写规格内容')
                return
            }
            /*if (this.inputValue.length > 5) {
                this.$message.error('规格最多5个字')
                return
            }*/
            ProductServiceAPI.addSkuAttributeValue({
                productSkuAttrId: this.skuId,
                value: this.inputValue
            }).then(res => {
                if (util.isSuccess(res)) {
                    this.list.push({
                        skuValueId: res.data.result.id.toString(),
                        skuValue: res.data.result.value,
                        selected: false
                    })
                }
            })
        },
        onSearchChange() {
            window.clearTimeout(this.timer)
            this.loading = 2
            this.timer = window.setTimeout(() => {
                this.getData()
            }, 350)
        },
        onSelected(item) {
            item.selected = !item.selected
            this.$emit('change', item)
        },
        onDeleted(item) {
            if (item.selected) {
                this.$message.warning('使用中的规格值无法删除')
            }
            this.$confirm({
                title: '删除提示', content: '确认删除规格值?', onOk: () => {
                    return new Promise(resolve => {
                        ProductServiceAPI.deleteSkuAttributeValue({
                            id: item.skuValueId
                        }).then(res => {
                            if (util.isSuccess(res)) {
                                this.$message.success('删除成功！')
                                this.list = this.list.filter(x => x.skuValueId !== item.skuValueId)
                                resolve()
                            }
                        })
                    })
                }
            })
        },
        onConfirm() {
            this.isShow = false
        }
    }
}
</script>

<style scoped>
    .sku-btn-val-add {
        margin: 10px 0 10px 0;
        position: relative;
    }

    .sku-btn-arrow {
        position: absolute;
        top: 24px;
        left: 20px;
        background-color: #fff;
        height: 15px;
        width: 15px;
        z-index: 21;
        transform: rotate(45deg);
        border-left: 1px solid #E3E2E5;
        border-top: 1px solid #E3E2E5;
        display: block;
    }

    .sku-btn-add-box {
        position: absolute;
        top: 32px;
        min-height: 200px;
        width: 645px;
        left: 0;
        z-index: 20;
        background-color: #fff;
        border: 1px solid #E3E2E5;
        box-shadow: 0 0 4px 0 rgba(200, 200, 200, 0.5);
        border-radius: 5px;
        padding: 20px;
        display: block;
    }

    .cell-box-bottom {
        margin-top: 10px;
    }

    .sku-btn-add-box .loading {
        font-size: 13px;
        height: 35px;
        line-height: 35px;
    }

    .sku-btn-add-box .cell-box {
        max-height: 200px;
        width: 100%;
    }

    .sku-btn-add-box .cell-box div {
        list-style: none;
        float: left;
     /*   width: 110px;*/
        height: 30px;
        background-color: #f2f2f6;
        margin-right: 10px;
        margin-top: 10px;
        font-size: 13px;
    }

    .sku-btn-add-box .cell-box div:hover {
        cursor: pointer;
        border: 1px solid #2589FF;
    }

    .sku-btn-add-box .cell-box div span {
        line-height: 30px;
        margin-left: 10px;
        overflow: hidden;
    }

    .sku-btn-add-box .cell-box div .close {
        line-height: 30px;
        display: inline-block;
        padding-right: 10px;
    }

    .sku-btn-add-box .cell-box .selected {
        background-color: #D3E7FF;
        color: #2589FF;
    }

</style>
