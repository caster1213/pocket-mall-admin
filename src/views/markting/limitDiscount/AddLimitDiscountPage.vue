<template>
  <page>
    <a-form-model style="margin-bottom: 45px" :label-col="{md:{span:3},xl:{span:2},lg:{span:3}}"
                  :wrapper-col="{span:10}">
      <div class="mb10">
        <nav-title title="基础设置"/>
      </div>
      <a-form-model-item label="活动名称" required>
        <a-input style="width: 200px"/>
      </a-form-model-item>
      <a-form-model-item label="活动预告设置" required>
        <a-radio-group default-value="1" class="radio-list" style="margin-top: 8px">
          <a-radio value="1">创建活动后进行活动预告</a-radio>
          <a-radio value="2">
            <span class="mr5">活动开始前</span>
            <a-input style="width: 60px"/>
            <span class="ml5">小时进行活动预告</span>
          </a-radio>
          <a-radio value="3">不进行预告</a-radio>
        </a-radio-group>
        <div>
          <span class="text-muted font-size-13">活动预告期间，商品详情页价格上方将会展示活动标题、开始时间和折扣力度。</span>
          <a-popover placement="top">
            <a class="font-size-13">查看示例</a>
            <template #content>
              <img width="240" src="../../../assets/img/limitDiscountPreview1.png"/>
            </template>
          </a-popover>
        </div>
      </a-form-model-item>
      <a-form-model-item label="活动日期" required>
        <a-range-picker/>
      </a-form-model-item>
      <a-form-model-item label="活动标题" required>
        <a-input style="width: 200px"/>
        <div>
          <span class="text-muted font-size-13">2-5个字，活动预告和活动进行期间展示于商品详情页。</span>
          <a-popover placement="top">
            <a class="font-size-13">查看示例</a>
            <template #content>
              <img width="240" src="../../../assets/img/limitDiscountPreview2.png"/>
            </template>
          </a-popover>
        </div>
      </a-form-model-item>
      <a-form-model-item label="优惠叠加" required>
        <a-radio-group>
          <a-radio>不叠加其他营销活动</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div class="mb10">
        <nav-title title="活动规则"/>
      </div>
      <a-form-model-item label="活动商品" required>
        <a-button class="text-action-btn" type="link">选择商品</a-button>
      </a-form-model-item>
      <a-form-model-item label="限购设置" required>
        <a-radio-group default-value="1" class="radio-list" style="margin-top: 8px">
          <a-radio value="1">不限购</a-radio>
          <a-radio value="2">
            <span class="mr5">每人每种商品限购</span>
            <a-input-number/>
            <span class="ml5">件，超出后无法购买</span>
          </a-radio>
          <a-radio value="3">
            <span class="mr5">每种商品前</span>
            <a-input-number/>
            <span class="ml5">件享受折扣，超出后可原价购买</span>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="活动倒计时" required>
        <a-radio-group default-value="1" class="radio-list" style="margin-top: 8px">
          <a-radio value="1">按活动倒计时</a-radio>
          <a-radio value="2">
            <span class="mr5">自定义倒计时周期</span>
            <a-input-number/>
            <span class="ml5">小时</span>
            <a-popover placement="rightTop">
              <a-icon class="ml5" type="question-circle"/>
              <template #content>
                <div style="width: 300px">
                  开启后，商品详情页的活动结束倒计时，将会按所设时间展示。举例：活动时间设为8:00~20:00，倒计时周期设为1小时，则活动开始后商详展示“距结束还剩01:00:00”，共循环12次。
                </div>
              </template>
            </a-popover>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <goods-select-pricker title="" :visible="false"/>
    <p-footer>
      <template #content>
        <a-button class="p-input-right">取消</a-button>
        <a-button type="primary">保存</a-button>
      </template>
    </p-footer>
  </page>
</template>

<script>
import Page from '../../../components/Page'
import NavTitle from '../../../components/Title'
import GoodsSelectPricker from "../../../components/GoodsSelectPricker"

export default {
  name: "AddLimitDiscountPage",
  components: {
    Page,
    NavTitle,
    GoodsSelectPricker
  }
}
</script>

<style scoped>

</style>