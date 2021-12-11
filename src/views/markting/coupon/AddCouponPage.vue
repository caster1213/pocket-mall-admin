<template>
  <p-page :loading="loading">
    <p-title type="line" title="基础设置"/>
    <div class="mt20">
      <a-form-model :model="model" :rules="modelRules" :label-col="{span:2}" :wrapper-col="{span:15}">
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
              <a-button v-if="model.productScopeType === 2" type="link" class="text-action-btn">选择商品</a-button>
            </a-radio>
            <goods-select-picker-result v-if="model.productScopeType === 2"/>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="使用门槛" required>
          <div class="mt5">
            <a-radio-group v-model="model.threshold" class="radio-list mt5">
              <a-radio :value="constant.couponThresholdType.all">无适用门槛</a-radio>
              <a-radio :value="constant.couponThresholdType.orderPriceMax">
                <span>订单满</span>
                <a-input :disabled="constant.couponThresholdType.orderPriceMax!== model.threshold" class="ml5 mr5"
                         style="width: 120px" addon-after="元"/>
                <span>可用</span>
              </a-radio>
              <a-radio :value="constant.couponThresholdType.orderCountMax">
                <span class="mr5">订单满</span>
                <a-input-number :disabled="constant.couponThresholdType.orderCountMax!== model.threshold"
                                style="width: 120px"/>
                <span class="ml5">件可用</span>
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-model-item>
        <a-form-model-item label="优惠内容" required>
          <span class="mr5">减免</span>
          <a-input style="width: 120px" addon-after="元"/>
        </a-form-model-item>
        <a-form-model-item label="用卷时间" required>
          <a-radio-group v-model="model.expireType" class="radio-list">
            <a-radio :value="constant.couponExpireType.range">
              <a-range-picker :disabled="constant.couponExpireType.range !== model.expireType"/>
            </a-radio>
            <a-radio :value="constant.couponExpireType.now">
              <span class="mr5">领劵后立即生效,有效期</span>
              <a-input :disabled="constant.couponExpireType.now !== model.expireType" style="width: 60px"/>
              <span class="ml5">天</span>
            </a-radio>
            <a-radio :value="constant.couponExpireType.delay">
              <span class="mr5">领劵</span>
              <a-input :disabled="constant.couponExpireType.delay !== model.expireType" style="width: 60px"/>
              <span class="ml5 mr5">天后生效，有效期</span>
              <a-input :disabled="constant.couponExpireType.delay !== model.expireType" style="width: 60px"/>
              <span class="ml5">天</span>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="优惠叠加">
          <a-checkbox :checked="model.isSuperposition" @change="model.isSuperposition = !model.isSuperposition">
            优惠券仅原件购买时可用
          </a-checkbox>
          <div class="text-muted font-size-12">
            勾选后，若商品参与限时折扣、多人拼团、满减/送等营销活动，则不可使用此优惠券/码。
          </div>
          <div class="text-muted font-size-12">
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
              <p-user-level-select-picker/>
              <p-user-level-select-picker-result/>
            </a-radio-group>
          </div>
        </a-form-model-item>
        <a-form-model-item label="每人限领次数">
          <div class="mt5">
            <a-radio-group v-model="receiveType" class="radio-list">
              <a-radio :value="true">不限制</a-radio>
              <a-radio :value="false">
                <a-input v-model="model.receiveCount" :disabled="receiveType" style="width: 100px" addon-after="次"/>
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
        <a-button type="primary">
          保存
        </a-button>
      </template>
    </p-footer>
  </p-page>
</template>

<script>
import {Coupon, rules} from './model'
import constant from '../../../common/constant'
import GoodsSelectPickerResult from "../../../components/GoodsSelectPrickerResult";

export default {
  name: 'AddCoupon',
  components: {GoodsSelectPickerResult},
  data() {
    return {
      constant: {
        couponType: constant.couponType,
        couponExpireType: constant.couponExpireType,
        couponThresholdType: constant.couponThresholdType,
        couponReceiveLimitType: constant.couponReceiveLimitType
      },
      loading: false,
      submitLoading: false,
      model: new Coupon(),
      receiveType: true,
      modelRules: rules
    }
  }
}
</script>

<style scoped>

</style>
