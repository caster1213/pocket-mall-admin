<template>
  <page :loading="loading">
    <div class="product-group-edit-container">
      <div class="product-group-preview">
        <div class="preview-head">
          <div class="preview-page-title">
            {{ getTitle }}
          </div>
        </div>
        <div class="preview-container">
          <div style="padding: 10px">
            <product-preview/>
          </div>
        </div>
      </div>
      <div class="product-group-setting">
        <div class="arrow-left"></div>
        <a-form-model :label-col="{span:5}" :wrapper-col="{span:18}">
          <a-form-model-item label="分组名称" required>
            <a-input/>
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-radio-group>
              <a-radio value="1">默认排序</a-radio>
              <a-radio value="2">自定义排序</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="第一优先级">
            <a-select>
              <a-select-option value="1">序号越大越靠前</a-select-option>
              <a-select-option value="2">销量越高越靠前</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="第二优先级">
            <a-select>
              <a-select-option value="1">创建时间越晚越靠前</a-select-option>
              <a-select-option value="2">创建时间越早越靠前</a-select-option>
              <a-select-option value="3">销量越高越靠前</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="分组筛选">
            <a-checkbox>是否开启</a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="列表样式">
            <a-radio-group style="margin-top: 5px">
              <a-radio value="1">大图</a-radio>
              <a-radio value="2">小图</a-radio>
              <a-radio value="3">大一两小</a-radio>
              <a-radio value="4">详细列表</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="购买按钮">
            <a-checkbox>是否显示</a-checkbox>
            <a-radio-group>
              <a-radio value="1">样式1</a-radio>
              <a-radio value="2">样式2</a-radio>
              <a-radio value="3">样式3</a-radio>
              <a-radio value="4">样式4</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="商品名">
            <a-checkbox>是否显示</a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="价格">
            <a-checkbox>是否显示</a-checkbox>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </page>
</template>

<script>
import Page from '../../components/Page'
import ProductPreview from "../../components/decorate/ProductPreview"

export default {
  name: "ProductGroupEditPage",
  components: {
    Page,
    ProductPreview
  },
  data() {
    return {
      loading: false,
      form:{
        title:''
      }
    }
  },
  computed:{
    getTitle(){
      if(this.form.title.length === 0){
        return '分组名称'
      }else{
        return this.form.title
      }
    }
  }
}
</script>

<style lang="less" scoped>
.product-group-edit-container {
  display: flex;
  justify-content: center;
}

.product-group-preview {
  width: 320px;
  margin-right: 30px;
  border: 1px dashed #155bd4;
  background-color: #f7f8fa;

  .preview-head {
    background: url("../../assets/img/page_preview_head.png") no-repeat;
    background-size: cover;
    width: 100%;
    height: 60px;
    position: relative;

    .preview-page-title {
      color: white;
      font-size: 16px;
      position: absolute;
      left: 125px;
      bottom: 5px;
    }
  }
}

.product-group-setting {
  width: 420px;
  background-color: #f7f8fa;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ebedf0;
  position: relative;

  .arrow-left {
    position: absolute;
    top: 20px;
    right: 100%;
    margin-left: -14px;
    left: 0;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 14px solid #f7f8fa;
    border-bottom: 7px solid transparent;
  }

  /deep/ .ant-form-item-label {
    font-size: 14px !important;
  }

  /deep/ .ant-select {
    width: 240px;
  }

  /deep/ .ant-select-selection-selected-value {
    font-size: 14px;
  }
}
</style>