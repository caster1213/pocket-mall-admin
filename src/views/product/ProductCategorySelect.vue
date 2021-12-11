<template>
    <div>
        <a-button class="font-size-12" v-if="selectResult.length === 0" @click="()=>{isShow = true}">选择商品类目</a-button>
        <div v-else class="font-size-12">
            <span>{{selectResult}}</span>
            <a @click="()=>{isShow = true}" class="ml15">修改类目</a>
        </div>
        <a-modal :visible="isShow" width="800px" title="选择商品类目" @ok="onConfirm"
                 @cancel="()=>{isShow = false}">
            <div style="margin-top: -20px;position: relative;" class="mb20">
                <a-input v-model="searchKey" @change="onTreeSearch" placeholder="请输入类目或类目关键词" class="font-size-12"
                         allow-clear/>
                <div v-if="searchResult.length>0" class="search-result-list">
                    <div class="font-size-12 search-result-list-option" v-for="(option,index) in searchResult"
                         :key="index"
                         @click="onSearchSelected(option.id)">
                        {{option.name}}
                    </div>
                </div>
            </div>
            <a-row class="box" type="flex">
                <div v-for="(col,index) in list" :key="index" :class="{'right-border':index<3}" class="column">
                    <div class="search">
                        <a-input v-model="col.searchValue" @change="onSearchChange(index)" allow-clear
                                 :placeholder="getPlaceholder(index)"
                                 class="font-size-12">
                            <a-icon slot="prefix" type="search"/>
                        </a-input>
                    </div>
                    <ul v-if="col.searchValue.length <= 0" class="font-size-12">
                        <li v-for="item in col.items" :key="item.id" :class="{'selected':item.selected}"
                            @click="onSelected(index,item)" class="category">
                            <a-row type="flex" justify="space-between">
                                <span style="max-width: 150px" class="text-row-1">{{item.name}}</span>
                                <a-icon v-if="item.count>0" class="arrow" type="right"/>
                            </a-row>
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="item in col.searchResult" :key="item.id" :class="{'selected':item.selected}"
                            @click="onSelected(index,item)" class="category">
                            <a-row type="flex" justify="space-between">
                                <span style="max-width: 150px" class="text-row-1">
                                    <p-search-text-result :select="col.searchValue" :name="item.name"/>
                                </span>
                                <a-icon v-if="item.count>0" class="arrow" type="right"/>
                            </a-row>
                        </li>
                    </ul>
                </div>
            </a-row>
            <div class="mt15">
                <span class="font-size-12">已选类目：</span>
                <span class="font-size-12 gray-6">{{getSelectValueText}}</span>
            </div>
        </a-modal>
    </div>
</template>

<script>
import ProductCategoryAPI from '../../service/product.category.service'
import util from '../../common/common'

let SearchTextResult = {
    functional: true,
    props: {
        name: String,
        select: String,
        render: Function
    },
    render: (h, ctx) => {
        let indexOf = ctx.props.name.indexOf(ctx.props.select)
        return (
            <span class="font-size-12">
                {ctx.props.name.substring(0, indexOf)}
                <b style="color:#38f;">{ctx.props.name.substring(indexOf, indexOf + ctx.props.select.length)}</b>
                {ctx.props.name.substring(indexOf + ctx.props.select.length)}
            </span>
        )
    }
}
export default {
    name: "ProductCategorySelect",
    components: {
        'p-search-text-result': SearchTextResult
    },
    props: {
        value: Number
    },
    created() {
        this.getData()
    },
    data() {
        return {
            selectPath: [],
            selectResult: '',
            searchKey: '',
            searchResult: [],
            paths: [],
            tree: [],
            isShow: false,
            dataSource: [],
            list: [],
            isConfirm: false
        }
    },
    computed: {
        getSelectValueText() {
            return this.selectPath.map(x => x.name).join(' > ')
        }
    },
    methods: {
        getData() {
            ProductCategoryAPI.all().then(res => {
                if (util.isSuccess(res)) {
                    this.dataSource = res.data.result.map(x => {
                        return {
                            id: x.id,
                            parentId: x.parentId,
                            name: x.name,
                            selected: false
                        }
                    })
                    this.list.push({
                        searchValue: '',
                        items: this.dataSource.filter(x => x.parentId === -1).map(x => {
                            return {
                                id: x.id,
                                parentId: -1,
                                name: x.name,
                                selected: false,
                                count: this.dataSource.filter(c => c.parentId === x.id).length
                            }
                        })
                    })
                    this.list.push({searchValue: '', items: [], searchResult: []})
                    this.list.push({searchValue: '', items: [], searchResult: []})
                    this.list.push({searchValue: '', items: [], searchResult: []})
                    this.buildTree()
                    this.bindSelectValue()
                    console.log(123)
                }
            })
        },
        onSelected(index, select) {
            this.clear(index)
            if (index < 3 && select.count > 0) {
                let newValue = {
                    searchValue: '',
                    items: this.dataSource.filter(x => x.parentId === select.id).map(x => {
                        return {
                            id: x.id,
                            parentId: x.parentId,
                            name: x.name,
                            selected: false,
                            count: this.dataSource.filter(c => c.parentId === x.id).length
                        }
                    }),
                    searchResult: []
                }
                this.list.splice(index + 1, 1, newValue)
            }
            this.selected(index, select)
        },
        clear(index) {
            for (let i = index + 1; i <= 3; i++) {
                let newValue = {searchValue: '', items: [], searchResult: []}
                this.list.splice(i, 1, newValue)
            }
        },
        selected(index, select) {
            let last = this.list[index].items.find(x => x.selected)
            if (last !== undefined) {
                if (last.id === select.id) {
                    this.selectPath.splice(index, 4 - index + 1, {id: select.id, name: select.name})
                    return
                }
                last.selected = false
            }
            select.selected = true
            this.list.splice(index, 1, this.list[index])
            this.selectPath.splice(index, 4 - index + 1, {id: select.id, name: select.name})
        },
        onSearchChange(index) {
            let input = this.list[index].searchValue
            if (input.length === 0) {
                /**
                 * 当前搜索条件被清除 下一层有选中 不重置状态
                 */
                if (this.list.isIndexOut(index + 1) === false) {
                    if (this.list[index + 1].items.findIndex(x => x.selected)) return
                }
                this.clear(index)
                this.list[index].items.forEach(x => x.selected = false)
                this.list.splice(index, 1, this.list[index])
                return
            }
            let result = this.list[index].items.filter(x => x.name.indexOf(input) >= 0)
            this.list[index].searchResult = result.map(x => x)
            this.list.splice(index, 1, this.list[index])
        },
        onSearchSelected(id) {
            this.searchValue = ''
            this.searchResult = []
            this.bindSelect(id)
        },
        onTreeSearch() {
            let key = this.searchKey
            this.searchResult = []
            if (key.length === 0) return
            for (let path of this.paths) {
                if (path[path.length - 1].name.indexOf(key) >= 0) {
                    this.searchResult.push({
                        name: path.map(x => x.name).join('>'),
                        id: path[path.length - 1].id
                    })
                }
            }
        },
        buildTree() {
            let findTree = (node) => {
                let children = this.dataSource.filter(x => x.parentId === node.id).map(x => {
                    return {
                        id: x.id,
                        name: x.name,
                        parent: node,
                        children: []
                    }
                })
                if (children.length === 0) return
                for (let child of children) {
                    node.children.push(child)
                    findTree(child)
                }
            }
            let tree = this.dataSource.filter(x => x.parentId === -1).map(x => {
                return {
                    id: x.id,
                    name: x.name,
                    parent: null,
                    children: []
                }
            })
            tree.forEach(x => {
                findTree(x)
            })
            let appendPath = (node, depth = 0, path = []) => {
                depth++
                if (node.children.length === 0) {
                    path.splice(depth, path.length - depth)
                    this.paths.push(path.map(x => {
                        return {
                            id: x.id,
                            name: x.name
                        }
                    }))
                    return
                }
                for (let child of node.children) {
                    path[depth] = child
                    appendPath(child, depth, path)
                }
            }
            for (let node of tree) {
                let path = [node]
                appendPath(node, 0, path)
            }
        },
        getPlaceholder(index) {
            if (index === 0) return '搜索一级类目'
            if (index === 1) return '搜索二级类目'
            if (index === 2) return '搜索三级类目'
            else return '搜索四级类目'
        },
        bindSelectValue() {
            if (this.value <= 0) return
            this.bindSelect(this.value)
        },
        getPath(eq) {
            for (let path of this.paths) {
                if (eq(path[path.length - 1])) {
                    return path
                }
            }
            return []
        },
        bindSelect(id) {
            let path = this.getPath(p => p.id === id)
            if (path.length === 0) return
            for (let i = 0; i < path.length; i++) {
                this.onSelected(i, this.list[i].items.find(x => x.id === path[i].id))
            }
            this.selectResult = path.map(x => x.name).join(' > ')
        },
        onConfirm() {
            let index = this.selectPath.length - 1
            let isConfirm = this.getPath(path => path.id === this.selectPath[index].id).length > 0
            if (isConfirm) {
                this.isShow = false
                this.isConfirm = isConfirm
                this.selectResult = this.selectPath.map(x => x.name).join(' > ')
                this.$emit('input', this.selectPath[index].id)
            } else {
                this.$message.warning('请选择一个类目')
            }
        }
    }
}
</script>

<style scoped>
    .box {
        border: 1px solid #d9d9d9;
    }

    .column {
        flex: 1;
        height: 350px;
        overflow-y: scroll;
    }

    .column .search {
        padding: 10px;
    }

    .column .category {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }

    .column .category:hover {
        background-color: #e8effa;
        cursor: pointer;
    }

    .arrow {
        color: #d9d9d9;
        padding-right: 10px;
        line-height: 30px;
    }

    .selected {
        background-color: #e8effa;
    }

    .right-border {
        border-right: 1px solid #d9d9d9;
    }

    .search-result-list {
        position: absolute;
        z-index: 100;
        background: #fff;
        box-shadow: 0 0 4px 0 rgba(200, 200, 200, 0.5);
        top: 35px;
        left: 0;
        border: 1px solid #d9d9d9;
        width: 100%;
        height: 200px;
        overflow-y: scroll;
    }

    .search-result-list-option {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }

    .search-result-list-option:hover {
        cursor: pointer;
        background-color: #e8effa;
    }
</style>
