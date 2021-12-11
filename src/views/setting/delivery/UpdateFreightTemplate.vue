<template>
  <div class="p-box p-box-bg-gary over">
    <a-row type="flex" justify="center">
      <a-form style="width: 100%" :form="form" :labelCol="{span:3}" :wrapperCol="{span:21}">
        <a-form-item :required="true" label="模板名称">
          <a-input style="width: 200px"
                   v-decorator="['name',{validateTrigger:['change','blur'],rules:[{required:true,message:'必须填写模板名称'}]}]"></a-input>
        </a-form-item>
        <a-form-item :required="true" label="模板类型">
          <a-radio-group @change="onChangeFreightType" v-decorator="['freightType']">
            <a-radio value="1"><span class="font-size-12">买家承担运费</span></a-radio>
            <a-radio value="2"><span class="font-size-12">卖家包邮</span></a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :required="true" label="计价方式">
          <a-radio-group @change="onChangeChargeType" v-decorator="['freightChargeType']">
            <a-radio value="1"><span class="font-size-12">按件数</span></a-radio>
            <a-radio value="2"><span class="font-size-12">按重量</span></a-radio>
            <a-radio value="3"><span class="font-size-12">按体积</span></a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :required="true" label="配送区域及运费">
          <div class="panel">
            <table class="table">
              <thead>
              <tr>
                <td class="font-bold" style="width: 40%">可配送区域</td>
                <td class="font-bold">首{{ getUnitText }}</td>
                <td class="font-bold">运费(元)</td>
                <td class="font-bold">续{{ getUnitText }}</td>
                <td class="font-bold">续费(元)</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(row,index) in rows" :key="index">
                <td>
                  <template v-if="row.area.length === 0">
                    <span class="font-size-12">请选择可配送区域编</span>
                  </template>
                  <template v-else>
                    <span class="font-size-12">{{ row.area }}</span>
                  </template>
                  <a-row style="margin-right: 20px" type="flex" justify="end">
                    <a @click="onOpenAreaModal(index)" style="margin-right: 5px">编辑</a>
                    <a @click="onDeleteRow(index)">删除</a>
                  </a-row>
                </td>
                <td>
                  <div style="margin: 10px 5px 10px 5px;width: 80%"
                       :class="{'has-error':row.firstUnit.hasError}">
                    <a-input
                        @change="row.firstUnit.onChange($event)"
                        v-model="row.firstUnit.value"
                        :disabled="row.firstUnit.disabled"
                    ></a-input>
                    <a-row v-if="row.firstUnit.hasError">
                                                  <span style="font-size: 12px">
                                                       {{ row.firstUnit.errorMessage }}
                                                  </span>
                    </a-row>
                  </div>
                </td>
                <td>
                  <div style="margin: 10px 5px 10px 5px;width: 80%"
                       :class="{'has-error':row.firstUnitPrice.hasError}">
                    <a-input
                        @change="row.firstUnitPrice.onChange($event)"
                        v-model="row.firstUnitPrice.value"
                        :disabled="row.firstUnitPrice.disabled"
                        :style="{'min-width':row.firstUnitPrice.width}"></a-input>
                    <a-row v-if="row.firstUnitPrice.hasError">
                                                  <span style="font-size: 12px">
                                                       {{ row.firstUnitPrice.errorMessage }}
                                                  </span>
                    </a-row>
                  </div>
                </td>
                <td>
                  <div style="margin: 10px 5px 10px 5px;width: 80%"
                       :class="{'has-error':row.nextUnit.hasError}">
                    <a-input
                        @change="row.nextUnit.onChange($event)"
                        v-model="row.nextUnit.value"
                        :disabled="row.nextUnit.disabled"
                        :style="{'min-width':row.nextUnit.width}"></a-input>
                    <a-row v-if="row.nextUnit.hasError">
                                                  <span style="font-size: 12px">
                                                       {{ row.nextUnit.errorMessage }}
                                                  </span>
                    </a-row>
                  </div>
                </td>
                <td>
                  <div style="margin: 10px 5px 10px 5px;width: 80%"
                       :class="{'has-error':row.nextUnitPrice.hasError}">
                    <a-input
                        @change="row.nextUnitPrice.onChange($event)"
                        v-model="row.nextUnitPrice.value"
                        :disabled="row.nextUnitPrice.disabled"
                        :style="{'min-width':row.nextUnitPrice.width}"></a-input>
                    <a-row v-if="row.nextUnitPrice.hasError">
                                                  <span style="font-size: 12px">
                                                       {{ row.nextUnitPrice.errorMessage }}
                                                  </span>
                    </a-row>
                  </div>
                  <!--  <a-input v-decorator="['nextUnitPrice'+row.cell4+'',{ validateTrigger: ['change', 'blur'],rules:[{
                        required:true,
                        whitespace: true,
                        message:'必须填写价格'
                    }]}]"
                             style="margin: 10px 5px 10px 5px;width: 80%"></a-input>-->
                </td>
              </tr>
              </tbody>
            </table>
            <a-button @click="onAddRow" class="font-size-12" style="margin: 10px">点击添加可配送区域和运费</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col span="10" offset="3">
        <a-button @click="onSubmit" :loading="loading" type="primary">保存</a-button>
      </a-col>
    </a-row>
    <a-modal @cancel="()=> areaVisible = false" @ok="onAreaSelectCompleted" :width="900"
             :bodyStyle="{height:'350px'}" title="选择地区" :visible="areaVisible">
      <div style="float: left" class="area-edit">
        <div class="area-edit-item">
                    <span><a-checkbox @change="onCheckedAll"
                                      v-model="currentRow.checkedAll"></a-checkbox></span>
          <span class="font-size-12" style="padding-left: 5px">全选</span>
        </div>
        <div v-for="province in provinceList" :key="province.key" @click="onClickNode(province,'province')"
             class="area-edit-item">
                    <span style="float: left"><a-checkbox v-model="province.checked"
                                                          @change="onTreeNodeChecked(province)"></a-checkbox></span>
          <span class="font-size-12" style="padding-left: 5px;float: left">{{ province.title }}</span>
          <span style="float: right">
                        <a-icon class="font-size-12" type="right"/>
                    </span>
        </div>
      </div>
      <div style="float: left" v-if="cityList.length>0" class="area-edit">
        <div v-for="item in cityList" :key="item.key" class="area-edit-item" @click="onClickNode(item,'city')">
                    <span style="float: left"><a-checkbox v-model="item.checked"
                                                          @change="onTreeNodeChecked(item)"></a-checkbox></span>
          <span class="font-size-12" style="padding-left: 5px;float: left">{{ item.title }}</span>
          <span style="float: right">
                        <a-icon class="font-size-12" type="right"/>
                    </span>
        </div>
      </div>
      <div style="float: left" v-if="districtList.length>0" class="area-edit">
        <div v-for="item in districtList" :key="item.key" class="area-edit-item">
                    <span style="float: left"><a-checkbox v-model="item.checked"
                                                          @change="onTreeNodeChecked(item)"></a-checkbox></span>
          <span class="font-size-12" style="padding-left: 5px;float: left">{{ item.title }}</span>
        </div>
      </div>
      <div style="float: right" class="area-edit over">
        <div class="select-title">
          <span class="font-size-12">已选省、市、区</span>
        </div>
        <a-tree :tree-data="currentRow.rightTree">
        </a-tree>
      </div>
    </a-modal>
  </div>
</template>

<script>
import constant from "../../../common/constant"
import freightTemplateService from "../../../service/freightTemplateService"
import {Field} from "../../../common/field"
import areaList from "../../../common/area"

export default {
  name: "UpdateFreightTemplate",
  data() {
    return {
      provinceList: [],
      cityList: [],
      districtList: [],
      form: this.$form.createForm(this),
      areaVisible: false,
      treeNodes: [],
      rows: [],
      freightChargeType: constant.freightChargeType.number,
      freightType: '',
      updateRowIndex: -1,
      currentRow: {checkedAll: false, treeNodes: []},
      old: {},
      loading: false
    }
  },
  created() {
    this.getTemplateData()
  },
  computed: {
    getUnitText() {
      switch (this.freightChargeType) {
        case constant.freightChargeType.number:
          return '件(个)'
        case constant.freightChargeType.weight:
          return '重(kg)'
        default:
          return '体积(m³)'
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.rows.length === 0) {
        this.$message.warning('请选择配送区域')
        return
      }
      this.form.validateFields((err, value) => {
        let errorCount = 0
        for (let row of this.rows) {
          row.firstUnit.validate()
          row.firstUnitPrice.validate()
          row.nextUnit.validate()
          row.nextUnitPrice.validate()
          if (row.firstUnit.hasError) errorCount += 1
          if (row.firstUnitPrice.hasError) errorCount += 1
          if (row.nextUnit.hasError) errorCount += 1
          if (row.nextUnitPrice.hasError) errorCount += 1
        }
        if (errorCount > 0) return
        if (err === null) {
          value.items = []
          for (let row of this.rows) {
            let item = {
              id: row.id,
              freightUnit: row.firstUnit.getValue(),
              firstPrice: row.firstUnitPrice.getValue(),
              nextFreightUnit: row.nextUnit.getValue(),
              nextPrice: row.nextUnitPrice.getValue(),
              districtName: row.area,
              district: row.selectNodes.join(','),
              updateStatus: row.updateStatus
            }
            value.items.push(item)
          }
          this.old.items.filter(x => x.updateStatus === constant.rowUpdateStatus.del).forEach(x => {
            value.items.push(x)
          })
        }
        freightTemplateService.update(value).then(res => {
          if (res.data.code === constant.serviceCode.success) {
            this.loading = false
            this.$message.success('编辑成功')
            this.$router.push('/setting/delivery').then()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    getTemplateData() {
      let id = this.$route.query.id
      freightTemplateService.get({id: id}).then(res => {
        this.old = res.data.result
        this.form.getFieldDecorator('name', {initialValue: res.data.result.name})
        this.form.getFieldDecorator('freightType', {initialValue: res.data.result.freightType.toString()})
        this.form.getFieldDecorator('freightChargeType', {initialValue: res.data.result.freightChargeType.toString()})
        this.form.getFieldDecorator('id', {initialValue: res.data.result.id, preserve: true})
        this.freightChargeType = res.data.result.freightChargeType
        for (let item of res.data.result.items) {
          this.appendRow(item.id, item.districtName, item.district.split(','), item.freightUnit, item.firstPrice, item.nextPrice, item.nextFreightUnit, constant.rowUpdateStatus.update)
          let row = this.rows[this.rows.length - 1]
          this.currentRow.treeNodes = row.treeNodes
          if (row.selectNodes.length === 0) {
            row.checkedAll = true
            for (let root of row.treeNodes) {
              root.checked = row.checkedAll
              this.childCheck(root.children, row.checkedAll)
            }
          } else {
            for (let key of row.selectNodes) {
              this.restoreTreeChecked(key, row.treeNodes)
            }
          }
        }
        console.log(this.rows)
      })
    },
    areaToText() {
      let result = ''
      if (this.currentRow.checkedAll) {
        return '全部地区'
      }
      let tree = this.currentRow.treeNodes.filter(x => x.checked)
      for (let root of tree) {
        let str = root.title + '['
        if (root.children.length === root.children.filter(x => x.checked).length) {
          str += '全境]、'
          result += str
          continue
        }
        for (let node of root.children) {
          if (node.checked === false) continue
          str += node.title + '、'
        }
        str = str.substring(0, str.length - 1)
        str += ']、'
        result += str
      }
      if (result[result.length - 1] === '、') {
        return result.substring(0, result.length - 1)
      } else {
        return result
      }
    },
    onAreaSelectCompleted() {
      this.currentRow.area = this.areaToText()
      if (this.currentRow.checkedAll) {
        this.currentRow.selectNodes = []
      }
      let tree = this.currentRow.treeNodes.filter(x => x.checked)
      for (let root of tree) {
        for (let node of root.children) {
          for (let district of node.children) {
            if (district.checked) {
              this.currentRow.selectNodes.push(district.key)
            }
          }
        }
      }
      this.areaVisible = false
    },
    onOpenAreaModal(index) {
      this.updateRowIndex = index
      this.currentRow = this.rows[index]
      this.provinceList = this.currentRow.treeNodes
      this.areaVisible = true
      this.toRightTree()
    },
    onChangeChargeType(e) {
      this.freightChargeType = parseInt(e.target.value)
      this.rows = []
      this.old.items.forEach(x => x.updateStatus = constant.rowUpdateStatus.del)
    },
    onChangeFreightType(e) {
      this.freightType = parseInt(e.target.value)
      this.rows = []
      this.old.items.forEach(x => x.updateStatus = constant.rowUpdateStatus.del)
    },
    onAddRow() {
      if (this.rows.length > 0) {
        if (this.rows[this.rows.length - 1].area.length === 0) {
          this.$message.warning('请选择配送区域')
          return
        }
      }
      this.appendRow(0, '', [], '', '', '', '', constant.rowUpdateStatus.add)
    },
    onDeleteRow(index) {
      let row = this.rows[index]
      let old = this.old.items.find(x => x.id === row.id)
      if (old !== undefined) {
        old.updateStatus = constant.rowUpdateStatus.del
        console.log('del' + old)
      }
      this.rows.splice(index, 1)
    },
    appendRow(id = '', area = '', selectNodes = [], firstUnit = '', firstUnitPrice = '', nextUnit = '', nextUnitPrice = '', updateStatus = '') {
      let required = {
        required: true,
        message: '必须填写'
      }
      let decimal = {
        pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
        message: '请填写正确的数字,小数点最多保留2位'
      }
      let _this = this
      let fun = {
        func(value) {
          let chargeType = _this.form.getFieldValue('freightChargeType')
          if (constant.freightChargeType.number === chargeType) {
            if (/^(0|[1-9][0-9]*)$/.test(value)) {
              this.message = '请填写正确的数字'
              return false
            } else {
              return true
            }
          } else {
            if (decimal.pattern.test(value)) {
              this.message = '请填写正确的数字,小数点最多保留2位'
              return false
            } else {
              return true
            }
          }
        },
        message: ''
      }
      let row = {
        id: id,
        area: area,
        selectNodes: selectNodes,
        treeNodes: this.initTreeNode(),
        rightTree: [],
        checkedAll: false,
        updateStatus: updateStatus
      }
      if (this.freightType === constant.freightType.sell) {
        row.firstUnit = new Field('firstUnit', '80%', 'number', 'input', '1', [required, fun], false, true)
        row.firstUnitPrice = new Field('firstUnitPrice', '80%', 'number', 'input', '0', [required, decimal], false, true)
        row.nextUnit = new Field('nextUnit', '80%', 'number', 'input', '1', [required, fun], false, true)
        row.nextUnitPrice = new Field('nextUnitPrice', '80%', 'number', 'input', '0', [required, decimal], false, true)
      } else {
        row.firstUnit = new Field('firstUnit', '80%', 'number', 'input', firstUnit, [required, fun])
        row.firstUnitPrice = new Field('firstUnitPrice', '80%', 'number', 'input', firstUnitPrice, [required, decimal])
        row.nextUnit = new Field('nextUnit', '80%', 'number', 'input', nextUnit, [required, fun])
        row.nextUnitPrice = new Field('nextUnitPrice', '80%', 'number', 'input', nextUnitPrice, [required, decimal])
      }
      this.rows.push(row)
    },
    initTreeNode() {
      let tree = []
      let eq = (basic, current, unit) => {
        let left = parseInt(basic)
        let right = parseInt(basic) + unit
        return current > left && current < right
      }
      for (let province in areaList.province_list) {
        let node1 = {
          key: province,
          pid: -1,
          title: areaList.province_list[province],
          checked: false,
          children: []
        }
        for (let city in areaList.city_list) {
          if (eq(province, city, 10000)) {
            let node2 = {
              key: city,
              pid: node1.key,
              title: areaList.city_list[city],
              checked: false,
              children: []
            }
            for (let county in areaList.county_list) {
              if (eq(city, county, 100)) {
                let node3 = {
                  key: county,
                  pid: node2.key,
                  title: areaList.county_list[county],
                  checked: false,
                  children: []
                }
                node2.children.push(node3)
              }
            }
            node1.children.push(node2)
          }
        }
        tree.push(node1)
      }
      return tree
    },
    restoreTreeChecked(key, tree) {
      if (tree.length === 0) return
      for (let node of tree) {
        if (node.key === key) {
          node.checked = true
          let n = this.getNode(node.pid)
          this.parentCheck(n)
          return
        } else {
          this.restoreTreeChecked(key, node.children)
        }
      }
    },
    onClickNode(e, district) {
      if (district === 'province') {
        this.cityList = e.children
        this.districtList = []
      }
      if (district === 'city') {
        this.districtList = e.children
      }
    },
    onTreeNodeChecked(e) {
      if (e.checked === false) {
        this.currentRow.checkedAll = false
      }
      this.parentCheck(this.getNode(e.pid))
      this.childCheck(e.children, e.checked)
      this.toRightTree()
      this.checkedAllAuto()
    },
    parentCheck(node) {
      if (node === undefined) return
      if (node === null) return
      //let checkLen = node.children.filter(x => x.checked === checked).length
      if (node.children.filter(x => x.checked === true).length > 0) {
        node.checked = true
      } else {
        node.checked = false
      }
      this.parentCheck(this.getNode(node.pid))
    },
    childCheck(nodes, checked) {
      if (nodes === undefined) return
      if (nodes === null) return
      if (nodes.length === 0) return
      for (let node of nodes) {
        node.checked = checked
        this.childCheck(node.children, checked)
      }
    },
    onCheckedAll() {
      for (let root of this.currentRow.treeNodes) {
        root.checked = this.currentRow.checkedAll
        this.childCheck(root.children, this.currentRow.checkedAll)
      }
      this.toRightTree()
    },
    checkedAllAuto() {
      let result = {
        checkedTotal: 0,
        total: 0
      }
      let counter = (nodes) => {
        result.checkedTotal += nodes.filter(x => x.checked).length
        result.total += nodes.length
        for (let node of nodes) {
          counter(node.children, result)
        }
      }
      counter(this.currentRow.treeNodes, result)
      this.currentRow.checkedAll = result.total === result.checkedTotal;
    },
    getNode(id) {
      if (id === -1) return null
      let find = (node, key, end = false, result = null) => {
        if (end) return result
        if (node.key === key) {
          end = true
          result = node
          return result
        }
        let index = node.children.findIndex(x => x.key === key)
        if (index > -1) {
          end = true
          result = node.children[index]
          return result
        }
        for (let child of node.children) {
          find(child, key, end, result)
        }
        return null
      }
      for (let root of this.currentRow.treeNodes) {
        let node = find(root, id)
        if (node) {
          return node
        }
      }
      return null
    },
    toRightTree() {
      let del = (nodes) => {
        if (nodes.length === 0) return
        while (nodes.filter(x => x.checked === false).length > 0) {
          let index = nodes.findIndex(x => x.checked === false)
          nodes.splice(index, 1)
        }
        for (let node of nodes) {
          del(node.children)
        }
      }
      let json = JSON.stringify(this.currentRow.treeNodes)
      let nodes = JSON.parse(json)
      del(nodes)
      this.currentRow.rightTree = nodes
    }
  }
}
</script>

<style scoped>
@import "../../../assets/css/page-box.css";

.area-edit {
  border: 1px solid #F2F2F6;
  border-radius: 6px;
  width: 160px;
  height: 300px;
  overflow-x: hidden;
  display: inline-block;
}

.select-title {
  padding: 5px 10px;
  height: 30px;
  line-height: 20px;
  box-sizing: border-box;
}


.area-edit-item {
  padding: 5px 10px;
  height: 30px;
  line-height: 20px;
  box-sizing: border-box;
}

.area-edit-item:hover {
  background-color: #F2F2F6;
}

.over /deep/ .ant-form-item-label label {
  font-size: 12px;
}

.over /deep/ .ant-form-item {
  margin-bottom: 14px;
}

.over /deep/ .ant-tree-title {
  font-size: 12px;
}

.table {
  font-size: 12px;
  width: 100%;
}

.table > thead > tr > td {
  height: 50px;
  background-color: #Fff;
  box-sizing: border-box;
  text-align: left;
  padding-left: 15px;
  border-right: 1px solid #ededef;
}

.table > thead > tr > td:last-child {
  border-right: 0 !important;
}

.table > tbody > tr > td:last-child {
  border-right: 0 !important;
}

.table > tbody > tr > td:first-child {
  border-left: 0 !important;
}

.table > tbody > tr {
  padding-left: 15px;
}

.table > tbody > tr > td {
  border-right: 1px solid #ededef;
  border-top: 1px solid #ededef;
  border-bottom: 1px solid #ededef;
  vertical-align: top;
  text-align: left;
  padding-left: 15px;
}

.has-error {
  border: #f5222d;
  color: #f5222d;
}

.has-error input {
  color: #f5222d;
}
</style>
