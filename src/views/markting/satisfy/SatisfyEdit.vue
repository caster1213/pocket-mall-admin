<template>
  <p-page>
    <a-form-model :model="model" :label-col="{span:3}" :wrapper-col="{span:15}">
      <p-title class="mb20" title="基本信息" type="line" />
      <a-form-model-item label="活动名称" required>
        <a-input />
      </a-form-model-item>
      <a-form-model-item label="活动时间" required>
        <a-range-picker />
      </a-form-model-item>
      <a-form-model-item label="优惠叠加" required>
        <a-radio-group class="radio-list">
          <a-radio value="1">不叠加其他活动</a-radio>
          <a-radio value="2">叠加其他活动</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="可叠加活动">
        <a-checkbox-group>
          <a-checkbox value="1">限时折扣</a-checkbox>
          <a-checkbox value="2">会员折扣</a-checkbox>
          <a-checkbox value="3">优惠卷</a-checkbox>
          <a-checkbox value="4">积分抵现</a-checkbox>
          <a-checkbox value="5">订单返现</a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
      <p-title class="mb20" title="活动规则" type="line" />
      <a-form-model-item label="活动商品" required>
        <a-radio-group class="radio-list">
          <a-radio value="1">全部商品</a-radio>
          <a-radio value="2">
            <span>指定商品参加</span>
            <div>
              <a @click="goodsSelectPickerVisible  = true" class="mt10" style="margin-left: 22px;display: block">选择商品</a>
              <span class="text-muted font-size-12" style="margin-left: 22px">最多选择5000个商品</span>
            </div>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="优惠设置" required>
        <a-radio-group @change="onDecreaseType" v-model="model.decreaseType" class="radio-list">
          <a-radio :value="1">阶梯满减</a-radio>
          <a-radio :value="2">循环满减</a-radio>
        </a-radio-group>
        <div class="ladder-container" v-if="model.decreaseType === 1">
          <div v-for="(ele,index) in list" :key="index">
            <p-title size="min" :title="`${index+1}级优惠`">
              <template v-if="list.length>1" #right>
                <a-button @click="onDeleteLadder(index)" type="link" class="text-action-btn font-size-12">删除</a-button>
              </template>
            </p-title>
            <satisfy-edit-ladder :model="ele" />
          </div>
          <div v-if="list.length<5" class="ladder-add">
            <a-divider type="horizontal" />
            <a-button @click="onAddLadder" type="link" class="text-action-btn">添加{{ list.length + 1 }}级优惠</a-button>
            <div class="font-size-12">提醒：每级优惠不叠加，如：满足二级优惠条件后则不再享有一级优惠。最多支持五级优惠。</div>
          </div>
        </div>
      </a-form-model-item>
    </a-form-model>
    <p-footer>
      <template #content>
        <a-button type="primary" class="mr20">保存</a-button>
        <a-button>取消</a-button>
      </template>
    </p-footer>
    <p-goods-select-pricker @close="goodsSelectPickerVisible = false" :visible="goodsSelectPickerVisible" />
  </p-page>
</template>

<script>
import SatisfyEditLadder from './SatisfyEditLadder'

export default {
  name: 'SatisfyEdit',
  components: {
    SatisfyEditLadder
  },
  data() {
    return {
      goodsSelectPickerVisible: false,
      isUpdate: false,
      model: {
        decreaseType: ''
      },
      list: []
    }
  },
  created() {
  },
  methods: {
    onDecreaseType() {
      if (this.model.decreaseType === 1 && this.list.length === 0) {
        this.list.push({})
      }
    },
    onAddLadder() {
      if (this.list.length >= 5) return
      this.list.push({})
    },
    onDeleteLadder(index) {
      console.log('delete index' + index)
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.ladder-container {

  .ladder-add {

  }
}
</style>
