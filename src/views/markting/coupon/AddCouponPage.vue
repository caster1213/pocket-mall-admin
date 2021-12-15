<template>
  <p-page :loading="loading">
    <p-title type="line" title="基础设置"/>
    <div class="mt20">
      <a-form-model ref="form" :model="model" :rules="modelRules" :label-col="{span:3}" :wrapper-col="{span:15}">
        <a-form-model-item label="优惠券名称" required prop="name">
          <a-input v-model="model.name" style="width: 240px"/>
        </a-form-model-item>
        <a-form-model-item label="名称备注" prop="label">
          <a-input v-model="model.label" style="width: 240px"/>
        </a-form-model-item>
        <a-form-model-item label="总发送数量" required prop="count">
          <a-input v-model="model.count" addon-after="张" style="width: 240px"/>
        </a-form-model-item>
        <a-form-model-item label="适用商品" required>
          <div>
            <span class="text-muted font-size-12">若活动商品中存在分销商品，优惠后可能造成利润受损。</span>
          </div>
          <a-radio-group v-model="model.productScopeType" class="radio-list">
            <a-radio :value="1">全部商品可用</a-radio>
            <a-radio :value="2">
              <span class="mr10">指定商品可用</span>
            </a-radio>
            <template v-if="model.productScopeType === 2">
              <a-button @click="goodsSelectPickerVisible = true"
                        type="link"
                        class="text-action-btn">选择商品
              </a-button>
              <p-goods-select-pricker @close="goodsSelectPickerVisible = false"
                                      @confirm="onGoodsSelectPickerConfirm"
                                      :select-type="goodsSelectPickerType"
                                      :select-goods-rows="model.goodsSelectRows"
                                      :visible="goodsSelectPickerVisible"/>
              <goods-select-picker-result v-if="goodsSelectPickerType === 'goods'"
                                          @delete="onGoodsSelectResultDelete"
                                          :goods="model.goodsSelectRows"/>
              <goods-select-picker-group-result v-if="goodsSelectPickerType === 'group'"
                                                @delete="onGoodsGroupSelectResultDelete"
                                                :list="model.goodsGroupSelectRows"/>
            </template>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="使用门槛" required>
          <div :class="{'mt5':model.type !== constant.couponType.reduction}">
            <a-radio-group v-model="model.threshold" class="radio-list mt5">
              <a-radio :value="constant.couponThresholdType.all">无适用门槛</a-radio>
              <a-radio v-if="model.type !== constant.couponType.reduction"
                       :value="constant.couponThresholdType.orderPriceMax">
                <span>订单满</span>
                <a-input v-model="model.thresholdOrderPriceValue"
                         :disabled="constant.couponThresholdType.orderPriceMax!== model.threshold"
                         class="ml5 mr5"
                         style="width: 120px" addon-after="元"/>
                <span>可用</span>
              </a-radio>
              <a-radio v-if="model.type !== constant.couponType.reduction"
                       :value="constant.couponThresholdType.orderCountMax">
                <span class="mr5">订单满</span>
                <a-input-number v-model="model.thresholdOrderCountValue"
                                :min="1"
                                :max="1000"
                                :disabled="constant.couponThresholdType.orderCountMax!== model.threshold"
                                style="width: 120px"/>
                <span class="ml5">件可用</span>
              </a-radio>
            </a-radio-group>
            <div v-if="model.rules.threshold.error" class="has-error">
              <div class="ant-form-explain">{{ model.rules.threshold.message }}</div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="优惠内容" required>
          <template v-if="model.type === constant.couponType.reward">
            <span class="mr5">减免</span>
            <a-input v-model="model.discountValue" @change="()=>{model.discountValid()}" style="width: 120px"
                     addon-after="元"/>
          </template>
          <template v-else-if="model.type === constant.couponType.discount">
            <span class="mr5">打</span>
            <a-input v-model="model.discountValue" @change="()=>{model.discountValid()}" style="width: 120px"
                     addon-after="折"/>
            <div class="mt10">
              <a-checkbox @change="model.isMaxDiscountValue = !model.isMaxDiscountValue" :checked="model.isMaxDiscountValue">最多优惠</a-checkbox>
              <a-input v-model="model.maxDiscountValue" style="width: 100px" addon-after="元"/>
            </div>
          </template>
          <template v-if="model.type === constant.couponType.freight">
            <span class="mr5">运费减免</span>
            <a-input v-model="model.discountValue" @change="()=>{model.discountValid()}" style="width: 120px"
                     addon-after="元"/>
          </template>
          <template v-if="model.type === constant.couponType.reduction">
            <span class="mr5 font-size-13">立减</span>
            <a-input v-model="model.discountValue" @change="()=>{model.discountValid()}" style="width: 120px"
                     addon-after="元"/>
          </template>
          <span style="display: block;width: 445px;line-height: 18px" class="text-muted font-size-12 mt5">优惠内容是商家单独给消费者的优惠金额，设置大额优惠金额时需谨慎，以免造成资损（测试活动建议设置小额优惠内容）。</span>
          <div v-if="model.rules.discount.error" class="has-error">
            <div class="ant-form-explain">{{ model.rules.discount.message }}</div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="用卷时间" required>
          <a-radio-group v-model="model.expireType" class="radio-list">
            <a-radio :value="constant.couponExpireType.range">
              <a-range-picker v-model="model.expireDate"
                              :disabled="constant.couponExpireType.range !== model.expireType"/>
            </a-radio>
            <a-radio :value="constant.couponExpireType.now">
              <span class="mr5">领劵后立即生效,有效期</span>
              <a-input v-model="model.expireDay" :disabled="constant.couponExpireType.now !== model.expireType"
                       style="width: 60px"/>
              <span class="ml5">天</span>
            </a-radio>
            <a-radio :value="constant.couponExpireType.delay">
              <span class="mr5">领劵</span>
              <a-input v-model="model.delayDay" :disabled="constant.couponExpireType.delay !== model.expireType"
                       style="width: 60px"/>
              <span class="ml5 mr5">天后生效，有效期</span>
              <a-input v-model="model.receiveDay" :disabled="constant.couponExpireType.delay !== model.expireType"
                       style="width: 60px"/>
              <span class="ml5">天</span>
            </a-radio>
          </a-radio-group>
          <div v-if="model.rules.expireDate.error" class="has-error">
            <div class="ant-form-explain">{{ model.rules.expireDate.message }}</div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="优惠叠加">
          <a-checkbox :checked="model.isSuperposition" @change="model.isSuperposition = !model.isSuperposition">
            优惠券仅原件购买时可用
          </a-checkbox>
          <div style="line-height: 18px" class="text-muted font-size-12">
            勾选后，若商品参与限时折扣、多人拼团、满减/送等营销活动，则不可使用此优惠券/码。
          </div>
          <div style="line-height: 18px" class="text-muted font-size-12">
            积分抵现仍可与优惠券/码同时使用
          </div>
        </a-form-model-item>
        <p-title class="mb10" type="line" title="发放和领取规则"/>
        <a-form-model-item label="领取人限制">
          <div class="mt5">
            <a-radio-group v-model="model.receiveLimitType" class="radio-list">
              <a-radio :value="constant.couponReceiveLimitType.all">
                不限制，所有人可领
              </a-radio>
              <a-radio :value="constant.couponReceiveLimitType.target">
                指定客户身份可领
              </a-radio>
              <template v-if="model.receiveLimitType === constant.couponReceiveLimitType.target">
                <p-user-level-select-picker :free-option="model.freeLevel"
                                            :charge-option="model.chargeLevel"
                                            @change="onLevelPickerChange"
                />
                <p-user-level-select-picker-result v-if="(model.freeLevel.length + model.chargeLevel.length)>0"
                                                   @freeDelete="onFreeLevelDelete"
                                                   @chargeDelete="onFreeLevelDelete"
                                                   :free="model.freeLevel"
                                                   :charge="model.chargeLevel"
                />
              </template>
            </a-radio-group>
            <div v-if="model.rules.level.error" class="has-error">
              <div class="ant-form-explain">{{ model.rules.level.message }}</div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="每人限领次数">
          <div class="mt5">
            <a-radio-group v-model="receiveType" class="radio-list">
              <a-radio :value="true">不限制</a-radio>
              <a-radio :value="false">
                <a-input-number v-model="model.receiveCount" :disabled="receiveType" style="width: 80px" :max="10"
                                :min="1"/>
                <span class="ml5">次</span>
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-model-item>
        <a-form-model-item label="过期提醒">
          <a-checkbox :checked="model.isExpireNotice" @change="model.isExpireNotice = !model.isExpireNotice">
            <span class="mr5">优惠券过期前</span>
            <a-select :disabled="model.isExpireNotice === false" v-model="model.expireNotice" style="width: 60px">
              <a-select-option :value="1">1</a-select-option>
              <a-select-option :value="2">2</a-select-option>
              <a-select-option :value="3">3</a-select-option>
              <a-select-option :value="4">4</a-select-option>
            </a-select>
            <span class="ml5">天提醒</span>
          </a-checkbox>
        </a-form-model-item>
      </a-form-model>
    </div>
    <p-footer>
      <template #content>
        <a-button class="mr20">
          取消
        </a-button>
        <a-button @click="onSubmit" type="primary">
          保存
        </a-button>
      </template>
    </p-footer>
  </p-page>
</template>

<script>
import {Coupon, rules} from './model'
import constant from '@/common/constant'
import GoodsSelectPickerResult from "@/components/GoodsSelectPrickerResult"
import GoodsSelectPickerGroupResult from "@/components/GoodsSelectPickerGroupResult"
import * as CouponService from '@/service/coupon.service'
import common from "@/common/common"

let coupon = new Coupon()
export default {
  name: 'AddCoupon',
  components: {GoodsSelectPickerGroupResult, GoodsSelectPickerResult},
  data() {
    return {
      constant: {
        couponType: constant.couponType,
        couponExpireType: constant.couponExpireType,
        couponThresholdType: constant.couponThresholdType,
        couponReceiveLimitType: constant.couponReceiveLimitType,
        productScopeType: constant.activityProductScopeType
      },
      loading: false,
      submitLoading: false,
      model: coupon,
      receiveType: true,
      goodsSelectPickerVisible: false,
      freeLevel: [],
      chargeLevel: [],
      goodsSelectPickerType: 'goods',
      goodsSelectRows: [],
      goodsGroupSelectRows: [],
      modelRules: rules,
      customValidate: {},
      isUpdate: false
    }
  },
  created() {
    this.model.type = parseInt(this.$route.query.type)
    this.isUpdate = this.$route.path.indexOf('update') > -1
  },
  methods: {
    onGoodsSelectPickerConfirm(rows, scopeType) {
      this.goodsSelectPickerVisible = false
      this.goodsSelectPickerType = scopeType
      if (scopeType === 'goods') {
        this.model.goodsSelectRows = rows
      }
      if (scopeType === 'group') {
        this.model.goodsGroupSelectRows = rows
      }
    },
    onGoodsSelectResultDelete(row) {
      let index = this.model.goodsSelectRows.findIndex(ele => ele.id === row.id)
      this.model.goodsSelectRows.splice(index, 1)
    },
    onGoodsGroupSelectResultDelete(row) {
      let index = this.model.goodsGroupSelectRows.findIndex(ele => ele.id === row.id)
      this.model.goodsGroupSelectRows.splice(index, 1)
    },
    onLevelPickerChange(e) {
      this.model.freeLevel = e.free
      this.model.chargeLevel = e.charge
    },
    onFreeLevelDelete(e) {
      let index = this.model.freeLevel.findIndex(ele => ele.level === e.level)
      this.model.freeLevel.splice(index, 1)
    },
    onChargeLevelDelete(e) {
      let index = this.model.chargeLevel.findIndex(ele => ele.level === e.level)
      this.model.chargeLevel.splice(index, 1)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid === this.model.valid()) {
          let args = this.model.to()
          if (this.isUpdate) {
            this.submitLoading = true
            CouponService.update(args).then(res => {
              this.submitLoading = false
              if (common.isSuccess(res)) {
                console.log(res)
              }
            })
          } else {
            CouponService.add(args).then(res => {
              this.submitLoading = false
              if (common.isSuccess(res)) {
                console.log(res)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
