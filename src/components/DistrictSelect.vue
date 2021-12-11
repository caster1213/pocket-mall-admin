<template>
    <div class="district-container" :style="{'width':width}">
        <a-input class="font-size-12" :placeholder="placeholder" v-model="text" readOnly>
            <a-icon @click="onClick" class="h" slot="addonAfter" type="down"/>
        </a-input>
        <div v-show="visible" class="district-box">
            <div class="select">
                <ul>
                    <li @click="onSelected('province')" :class="{'active':active === 'province'}">
                        <span class="h4 font-size-12">省</span>
                    </li>
                    <li @click="onSelected('city')" :class="{'active':active === 'city'}">
                        <span class="h4 font-size-12">市</span>
                    </li>
                    <li @click="onSelected('district')" :class="{'active':active === 'district'}">
                        <span class="h4 font-size-12">区</span>
                    </li>
                </ul>
            </div>
            <a-row type="flex">
                <a-col @click="onChecked(item.value,index)" v-for="(item,index) in getCurrentList" :key="item.value"
                       span="6" class="row">
                    <span class="cell" :class="{'cell-active':item.active}">{{item.label}}</span>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import area from '../common/area'

export default {
    name: "DistrictSelect",
    props: {
        width: String,
        value: Array,
        placeholder: String
    },
    data() {
        return {
            visible: false,
            active: 'province',
            provinceList: [],
            cityList: [],
            districtList: [],
            current: [],
            options: ['', '', ''],
            text: ''
        }
    },
    computed: {
        getCurrentList() {
            if (this.active === 'province') {
                return this.provinceList
            } else if (this.active === 'city') {
                if (this.options.length >= 2) {
                    return this.cityList.filter(x => x.value.substring(0, 2) === this.options[0].substring(0, 2))
                } else {
                    return []
                }
            } else {
                if (this.options.length === 3) {
                    return this.districtList.filter(x => x.value.substring(0, 4) === this.options[1].substring(0, 4))
                } else {
                    return []
                }
            }
        }
    },
    created() {
        for (const key in area.province_list) {
            this.provinceList.push({
                label: area.province_list[key],
                value: key,
                active: false
            })
        }
        for (const key in area.city_list) {
            this.cityList.push({
                label: area.city_list[key],
                value: key,
                active: false
            })
        }
        for (const key in area.county_list) {
            this.districtList.push({
                label: area.county_list[key],
                value: key,
                active: false
            })
        }
        if (this.value.length === 3) {
            this.options = this.value
            this.save()
        }
    },
    methods: {
        onClick() {
            this.visible = !this.visible
        },
        onSelected(e) {
            this.active = e
        },
        onChecked(e, index) {
            if (this.active === 'province') {
                this.provinceChecked(e)
                this.setActive(e, index, this.provinceList)
                this.active = 'city'
            } else if (this.active === 'city') {
                this.cityChecked(e)
                this.setActive(e, index, this.cityList.filter(x => x.value.substring(0, 2) === this.options[0].substring(0, 2)))
                this.active = 'district'
            } else {
                this.districtChecked(e)
                this.setActive(e, index, this.districtList.filter(x => x.value.substring(0, 4) === this.options[1].substring(0, 4)))
                this.visible = false
                this.save()
            }
        },
        provinceChecked(value) {
            this.options[0] = value
            this.options[1] = ''
            this.options[2] = ''
        },
        cityChecked(value) {
            this.options[1] = value
            this.options[2] = ''
        },
        districtChecked(value) {
            this.options[2] = value
        },
        setActive(e, index, list) {
            let selected = list.find(x => x.active === true)
            if (selected === undefined) {
                list[index].active = true
            } else {
                if (selected.value !== e) {
                    selected.active = false
                    list[index].active = true
                }
            }
        },
        save() {
            let c1 = this.provinceList.find(x => x.value === this.options[0]).label
            let c2 = this.cityList.find(x => x.value === this.options[1]).label
            let c3 = this.districtList.find(x => x.value === this.options[2]).label
            this.text = `${c1}/${c2}/${c3}`
            this.$emit('input', this.options)
        }
    }
}
</script>

<style scoped>
    .district-container {
        position: relative;
    }

    .district-container /deep/ .ant-input {
        font-size: 12px !important;
    }

    .district-box {
        position: absolute;
        left: 0;
        top: 30px;
        z-index: 100;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        font-size: 12px !important;
        min-width: 580px;
        border-radius: 6px;
        padding-bottom: 10px;
    }

    .select {
        padding: 10px;
        margin-bottom: 10px;
    }

    .select ul li {
        list-style: none;
        display: inline-block;
        height: 30px;
        width: 80px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 5px;
    }

    .select ul li:hover {
        background-color: #F2F2F6;
    }

    .select .active {
        background-color: #F2F2F6;
    }

    .row {
        padding: 5px;
    }

    .cell {
        max-width: 130px;
        padding: 0 10px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
    }

    .cell:hover {
        background-color: #F2F2F6;
        font-weight: bold;
        border-radius: 6px;
    }

    .cell-active {
        background-color: #F2F2F6;
        font-weight: bold;
        border-radius: 6px;
    }

    .h {
        cursor: pointer;
    }
</style>
