<template>
  <div class="lucky-lottery-step-rule-container">
    <a-row type="flex" justify="center">
      <div class="page-preview">
        <img src="../../../assets/img/lucky-lottery-preview.png"/>
      </div>
      <div style="width: 600px">
        <span class="title">页面配置</span>
        <a-divider/>
        <a-form-model :label-col="{md:{span:5},xl:{span:5}}"
                      :wrapper-col="{md:{span:19},xl:{span:19}}">
          <a-form-model-item label="背景图片">
            <a-row type="flex">
              <a-upload list-type="picture-card" name="file">
                <a-icon style="font-size: 20px" type="plus"/>
              </a-upload>
              <span class="text-muted">建议尺寸1125*2073像素，支持JPG、PNG、JPEG格式
            </span>
            </a-row>
          </a-form-model-item>
          <a-form-model-item label="中奖名单">
            <a-radio-group>
              <a-radio value="1">展示</a-radio>
              <a-radio value="2">不展示</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="活动说明">
            <a-textarea :auto-size="{minRows:5}" style="min-width: 350px"></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "AddLuckyLotteryDecorate"
}
</script>

<style lang="less" scoped>
@import "page-style";

/deep/ .ant-upload.ant-upload-select-picture-card {
  width: 55px;
  height: 55px;
}
</style>