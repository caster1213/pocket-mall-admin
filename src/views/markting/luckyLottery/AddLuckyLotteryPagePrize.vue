<template>
  <div class="lucky-lottery-step-rule-container">
    <a-row type="flex" justify="center">
      <div class="page-preview">
        <img src="../../../assets/img/lucky-lottery-preview.png"/>
      </div>
      <div style="width: 580px">
        <span class="title">奖品设置</span>
        <a-divider/>
        <div class="mb5">
          <a-button @click="dialogVisible=true" type="link" class="text-action-btn" style="font-size: 14px">添加奖品</a-button>
        </div>
        <a-table :columns="columns"/>
        <div style="margin-top: 25px">
          <span class="lucky-lottery-prize-container-title">未中奖设置</span>
          <a-divider style="margin-top: 12px;margin-bottom: 12px"/>
          <a-form-model :label-col="{span:3}">
            <a-form-item label="名称">
              <a-input style="width: 150px"/>
            </a-form-item>
            <a-form-item label="提示语">
              <a-input style="width: 150px"/>
            </a-form-item>
            <a-form-item label="图标">
              <div class="img-upload">
                <img src="https://img01.yzcdn.cn/luckydraw/ths.png"/>
                <div class="btn">修改</div>
              </div>
            </a-form-item>
          </a-form-model>
        </div>
        <div style="margin-top: 25px">
          <span class="lucky-lottery-prize-container-title">参与送积分</span>
          <a-divider style="margin-top: 12px;margin-bottom: 12px"/>
          <div>
            <span class="font-size-13 mr5">送</span>
            <a-input style="width: 60px"/>
            <span class="font-size-13 ml5">积分</span>
            <div class="mt5">
              <a-checkbox>仅送给未中奖用户</a-checkbox>
            </div>
          </div>
        </div>
      </div>
    </a-row>
    <a-modal :visible="dialogVisible" @cancel="dialogVisible=false" title="添加奖品">
      <a-form-model :label-col="{span:4}">
        <a-form-model-item label="奖品名称">
          <a-input style="width: 180px"/>
        </a-form-model-item>
        <a-form-model-item label="奖品">
          <a-input style="width: 80px"/>
          <span class="ml5">积分</span>
        </a-form-model-item>
        <a-form-model-item label="图标">
          <div class="img-upload">
            <img src="https://img01.yzcdn.cn/luckydraw/ths.png"/>
            <div class="btn">修改</div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="数量">
          <a-input style="width: 80px"/>
          <span class="ml5">份</span>
        </a-form-model-item>
        <a-form-model-item label="中奖几率">
          <a-input style="width: 80px"/>
          <span class="ml5 mr5">%</span>
          <a-popover placement="bottom">
            <a-icon type="question-circle" />
            <template #content>
              <div style="width: 240px">中奖概率为用户每次抽奖时独立事件的概率。举例：若中奖率为10%，则每个用户中奖的概率为10%，并不是10个人中一定出现1个奖品。</div>
            </template>
          </a-popover>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AddLuckyLotteryPagePrize",
  props: {},
  data() {
    return {
      dialogVisible:false,
      columns: [{
        title: '名称'
      }, {
        title: '奖品'
      }, {
        title: '图标'
      }, {
        title: '数量'
      }, {
        title: '已发放'
      }, {
        title: '中奖概率'
      }, {
        title: '操作'
      }]
    }
  }
}
</script>

<style lang="less" scoped>

@import "page-style";

.img-upload {
  width: 50px;
  height: 50px;
  position: relative;
  display: flex;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  .btn {
    height: 20px;
    line-height: 20px;
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
    color: white;
  }
}
</style>