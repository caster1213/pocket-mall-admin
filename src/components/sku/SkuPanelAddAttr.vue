<template>
    <a-row type="flex">
        <a-auto-complete class="font-size-12"
                         style="width: 180px;position: relative;"
                         placeholder="选择或输入规格"
                         @focus="onFocus"
                         @search="onSearch"
                         @select="onSelect"
                         option-label-prop="title"
        >
            <template slot="dataSource">
                <a-select-option v-for="item in list" :value="item.skuId"
                                 :key="item.skuId">
                    {{item.skuName}}
                </a-select-option>
            </template>
            <a-input v-model="inputValue" class="font-size-12 search-input">
                <a-button
                        slot="suffix"
                        class="search-input-btn font-size-12"
                        @click="onSave"
                >
                    新增
                </a-button>
            </a-input>
        </a-auto-complete>
        <span style="line-height: 32px;margin-left: 70px;" class="text-muted font-size-12">规格最多输入5个字</span>
    </a-row>
</template>

<script>

export default {
    name: "SkuPanelAddAttr",
    props: {
        value: Array
    },
    data() {
        return {
            list: [],
            inputValue: ''
        }
    },
    watch: {
        value(newValue) {
            this.list = newValue.map(x => x)
        }
    },
    methods: {
        onFocus() {
            this.list = this.value.map(x => x)
        },
        onSearch(value) {
            if (value === '') {
                return this.list = this.value.map(x => x)
            }
            let result = []
            for (let item of this.value) {
                if (item.skuName.indexOf(value) > -1) {
                    result.push(item)
                }
            }
            this.list = result
            return result
        },
        onSelect(e) {
            this.$emit('select', this.value.find(x => x.skuId === e))
        },
        onSave() {
            this.$emit('save', this.inputValue)
        }
    }
}
</script>

<style scoped>
    .search-input /deep/ .ant-input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }

    .search-input-btn {
        position: absolute;
        left: 12px;
        border-left: 0;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
</style>
