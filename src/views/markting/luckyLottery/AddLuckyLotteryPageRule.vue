<template>
  <div class="lucky-lottery-step-rule-container">
    <a-row type="flex" justify="center">
      <div class="page-preview">
        <img src="../../../assets/img/lucky-lottery-preview.png"/>
      </div>
      <div>
        <span class="title">奖品设置</span>
        <a-divider/>
        <a-form-model class="luck-lottery-rule-container-form" :label-col="{md:{span:5},xl:{span:5}}"
                      :wrapper-col="{md:{span:19},xl:{span:19}}">
          <a-form-item label="活动名称" required>
            <a-input style="width: 200px" placeholder="请输入活动名称"/>
          </a-form-item>
          <a-form-item label="活动日期" required>
            <a-range-picker/>
          </a-form-item>
          <a-form-item label="参与限制">
            <a-radio-group class="radio-list" style="margin-top: 5px">
              <a-radio value="1">
                <span>不限制，所有人可参与</span>
              </a-radio>
              <a-radio value="2">
                <span>部分人可参与</span>
                <div style="margin-left: 24px;margin-top: 5px">
                  <span>通过会员等级选择:</span>
                  <a-popover placement="bottom" trigger="click">
                    <a class="ml5">选择会员等级</a>
                    <template #content>
                      <div>
                        <span class="mr10 font-size-13">选择客户身份</span>
                        <a-button type="link" class="text-action-btn">刷新</a-button>
                      </div>
                      <div>
                        <a-checkbox-group>
                          <a-checkbox value="1">注册会员</a-checkbox>
                          <a-checkbox value="2">青铜会员</a-checkbox>
                          <a-checkbox value="3">白银会员</a-checkbox>
                          <a-checkbox value="4">黄金会员</a-checkbox>
                          <a-checkbox value="5">钻石会员</a-checkbox>
                        </a-checkbox-group>
                      </div>
                      <a-row class="mt10" type="flex" justify="end">
                        <a-button>取消</a-button>
                        <a-button class="ml10" type="primary">确认</a-button>
                      </a-row>
                    </template>
                  </a-popover>
                </div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="活动类型">
            <a-radio-group class="radio-list" style="margin-top: 5px">
              <a-radio value="1">无限制抽奖</a-radio>
              <a-radio value="2">
                <span>积分抽奖</span>
                <span class="ml5 mr5">消耗</span>
                <a-input style="width: 60px"/>
                <span class="ml5">积分</span>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="参与次数">
            <a-radio-group class="radio-list" style="margin-top: 5px">
              <a-radio value="1">
                <span>每日最多抽奖次数</span>
                <div class="mt5">
                  <span class="mr5">每人每天抽</span>
                  <a-input style="width: 60px"/>
                  <span class="ml5">次</span>
                </div>
              </a-radio>
              <a-radio value="2">
              <span>
                <span>每人最多抽奖次数</span>
                <div class="mt5">
                  <span class="mr5">每人一共可抽</span>
                  <a-input style="width: 60px"/>
                  <span class="ml5">次</span>
                </div>
              </span>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form-model>
      </div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "AddLuckyLotteryPageRule"
}
</script>

<style lang="less" scoped>

@import "page-style";
</style>