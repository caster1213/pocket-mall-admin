<template>
  <page :loading="loading" :type="'line'">
    <nav-title title="积分规则设置"/>
    <div class="mt20">
      <a-form-model :label-col="{span:3}">
        <a-form-model-item label="规则名称" required>
          <a-input v-model="ruleName" style="width: 180px" placeholder="请输入规则名称"/>
        </a-form-model-item>
        <a-form-model-item label="积分规则" required>
          <a-radio-group @change="onRuleTypeChange" v-model="selectRuleType" class="radio-list" style="margin-top: 3px">
            <a-radio :value="3">
              <span class="mr5">每购买金额</span>
              <a-input v-model="saleAmountRate" :disabled="selectRuleType === 2" addon-after="%" style="width: 100px"/>
              <span class="ml5">作为积分奖励</span>
            </a-radio>
            <a-radio :value="2">
              <span class="mr5">每购买金额</span>
              <a-input v-model="saleAmount" :disabled="selectRuleType === 3" addon-after="元" style="width: 100px"/>
              <span class="ml5 mr5">奖励积分</span>
              <a-input v-model="awardPoint" :disabled="selectRuleType === 3" addon-after="分" style="width: 100px"/>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="适用商品" required>
          <a-radio-group v-model="goodsSelectType" class="radio-list" style="margin-top: 8px">
            <a-radio :value="-1">全部商品参与</a-radio>
            <a-radio :value="1">
              <span class="mr5">指定商品参与</span>
              <a-button v-show="goodsSelectType === 1" @click="goodsSelectPickerVisible=true" class="text-action-btn"
                        type="link">选择商品
              </a-button>
              <div style="margin-left: 25px">
                <span class="text-muted font-size-12">客户下单时，仅指定商品返积分。</span>
              </div>
              <div v-show="goodsSelectType === 1 && selectGoodsPickerRows.length>0" style="margin-left: 25px"
                   class="mt20">
                <a-table v-if="selectGoodsPickerType === 'goods'" row-key="id" :columns="goodsColumns"
                         :data-source="selectGoodsPickerRows"></a-table>
                <a-table v-else :columns="groupColumns" row-key="id" :data-source="selectGoodsPickerRows"></a-table>
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </div>
    <p-footer>
      <template #content>
        <a-button :loading="loadingBtn" @click="onSubmit" type="primary">保存</a-button>
      </template>
    </p-footer>
    <goods-select-pricker @confirm="onGoodsPickerChange" @close="goodsSelectPickerVisible = false" title="选择可用商品"
                          :visible="goodsSelectPickerVisible" :select-goods-rows="selectGoodsPickerRows"
                          :select-type="selectGoodsPickerType"/>
  </page>
</template>

<script>
import Page from '../../components/Page'
import NavTitle from '../../components/Title'
import GoodsSelectPricker from "../../components/GoodsSelectPricker"
import constant from "../../common/constant"
import PointService from '../../service/point.service'

export default {
  name: "PointRuleAddPage",
  components: {
    Page,
    NavTitle,
    GoodsSelectPricker
  },
  data() {
    return {
      loading: false,
      loadingBtn: false,
      pageType: '',
      ruleName: '',
      goodsSelectType: -1,
      selectRuleType: 2,
      saleAmountRate: '',
      saleAmount: '',
      awardPoint: '',
      selectGoodsPickerRows: [],
      selectGoodsPickerType: 'goods',
      goodsSelectPickerVisible: false,
      goodsColumns: [{
        title: '商品名称',
        width: 300,
        customRender: (value, row) => {
          let imageUrl = row.imageUrl.split(',')[0]
          return (<a-row type="flex">
            <div>
              <img width="60px" height="60px" src={imageUrl}/>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: space-around;" class="ml10">
              <div style="width:150px">
                <a class="line1">{row.title}</a>
              </div>
              <span style="font-weight:700;color:#ed6a0c">¥{value.minSalePrice}</span>
            </div>
          </a-row>)
        }
      }, {
        title: '库存',
        dataIndex: 'inventory'
      }, {
        title: '操作',
        customRender: (value, row) => {
          return <a-button onClick={() => {
            this.onDeleteSelectRow(row)
          }} class="text-action-btn" type="link">删除</a-button>
        }
      }],
      groupColumns: [{
        title: '分组名称',
        dataIndex: 'name',
        width: 300
      }, {
        title: '商品数量',
        dataIndex: 'productTotal'
      }, {
        title: '操作',
        customRender: (value, row) => {
          return <a-button onClick={() => {
            this.onDeleteSelectRow(row)
          }} class="text-action-btn" type="link">删除</a-button>
        }
      }]
    }
  },
  created() {
    if (this.$route.query.hasOwnProperty("id")) {
      this.load()
    }
  },
  methods: {
    load() {
      let id = this.$route.query.id
      this.loading = true
      PointService.getCustomRule({id: id}).then(res => {
        this.loading = false
        let model = res.data.result.model
        this.ruleName = model.name
        this.selectRuleType = model.ruleType
        this.goodsSelectType = model.productRule
        this.selectGoodsPickerType = model.productRange === 1 ? 'goods' : 'group'
        this.selectGoodsPickerRows = res.data.result.selectRows
        if (this.selectRuleType === constant.pointCustomRuleType.saleAmountRate) {
          this.saleAmountRate = model.awardPoint
        } else {
          this.saleAmount = model.saleAmount
          this.awardPoint = model.awardPoint
        }
      })
    },
    onGoodsPickerChange(rows, type) {
      this.goodsSelectPickerVisible = false
      this.selectGoodsPickerRows = rows
      this.selectGoodsPickerType = type
    },
    onDeleteSelectRow(value) {
      let index = this.selectGoodsPickerRows.findIndex(ele => ele.id === value.id)
      this.selectGoodsPickerRows.splice(index, 1)
    },
    onRuleTypeChange() {
      if (this.selectRuleType === 3) {
        this.saleAmountRate = ''
      } else {
        this.saleAmount = ''
        this.awardPoint = ''
      }
    },
    onSubmit() {

      let args = {
        name: this.ruleName,
        ruleType: this.selectRuleType,
        productRule: this.goodsSelectType,
        productRange: this.selectGoodsPickerType === 'goods' ? 1 : 2,
        saleAmount: '0',
        awardPoint: '0',
        rangeId: '',
      }
      if (this.selectRuleType === constant.pointCustomRuleType.saleAmount) {
        args.saleAmount = this.saleAmount
        args.awardPoint = this.awardPoint
      } else {
        args.awardPoint = this.saleAmountRate
      }
      args.rangeId = this.selectGoodsPickerRows.map(ele => ele.id).join(',')
      this.loadingBtn = true
      if (this.$route.query.hasOwnProperty("id")) {
        args.id = this.$route.query.id
        PointService.updateCustomRule(args).then(res => {
          this.loadingBtn = false
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success("保存成功")
            this.$router.push('/user/point/rule')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        PointService.addCustomRule(args).then(res => {
          this.loadingBtn = false
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success("保存成功")
            this.$router.push('/user/point/rule')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }

    }
  }
}
</script>

<style scoped>

</style>