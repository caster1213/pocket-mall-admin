<template>
    <div class="components-form-demo-advanced-search">
        <a-row>
            <a-col span="10">
                <a-input-group compact>
                    <a-select v-model="selectName" default-value="phone">
                        <a-select-option value="phone">
                            用户电话
                        </a-select-option>
                        <a-select-option value="name">
                            用户昵称
                        </a-select-option>
                    </a-select>
                    <a-input v-model="selectValue" style="width: 50%"/>
                    <a-button @click="load" style="margin-left: 10px" type="primary">查询</a-button>
                </a-input-group>
            </a-col>
        </a-row>
        <a-row style="margin-top: 15px">
            <a-tree v-model="model" showLine :load-data="next" :tree-data="tree"/>
        </a-row>
    </div>
</template>

<script>
import UserApi from '../../service/user.service'


export default {
    name: "UserTree",
    data() {
        return {
            model: [],
            tree: [],
            selectName: 'phone',
            selectValue: ''
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            let request = {}
            request[this.selectName] = this.selectValue
            UserApi.loadTree(request).then(res => {
                if (res.data.code === 0) {
                    this.tree = res.data.result.map(x => {
                        return {
                            title: x.name + '-' + x.phone,
                            key: x.id.toString(),
                            children: []
                        }
                    })
                    console.log(this.tree)
                    this.model= []
                }
            })
        },
        next(node) {
            return new Promise((resolve, reject) => {
                UserApi.nextTree({id: node.dataRef.key}).then(res => {
                    if (res.data.code === 0) {
                        node.dataRef.children = res.data.result.map(x => {
                            return {
                                title: x.name + '-' + x.phone,
                                key: x.id.toString(),
                                children: []
                            }
                        })
                        resolve()
                    }
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
