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
          <div v-if="form.isSearchShow" class="search">
            <a-input-search placeholder="商品" />
          </div>
          <div v-if="form.isFilterShow" class="filter">
            <div>综合推荐</div>
            <a-row type="flex" align="middle">
              <span>销量</span>
              <sort-one theme="outline" size="15" fill="#333" :strokeWidth="3" />
            </a-row>
            <div>价格</div>
          </div>
          <div style="padding: 10px">
            <product-preview :style-type="form.productGroupStyle"
                             :btn-style="form.productGroupBtnStyle"
                             :is-goods-name="form.isProductNameShow"
                             :is-price-show="form.isPriceShow"
                             :is-show-btn="form.isBtnShow" />
          </div>
        </div>
      </div>
      <div class="product-group-setting">
        <div class="arrow-left"></div>
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:18}">
          <a-form-model-item label="分组名称" required prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-radio-group default-value="2">
              <a-radio value="2">自定义排序</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="第一优先级">
            <a-select v-model="form.productGroupSort1">
              <a-select-option :value="constant.sort.number">序号越大越靠前</a-select-option>
              <a-select-option :value="constant.sort.sale">销量越高越靠前</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="第二优先级">
            <a-select v-model="form.productGroupSort2">
              <a-select-option :value="constant.sort.dateDesc">创建时间越晚越靠前</a-select-option>
              <a-select-option :value="constant.sort.dateAsc">创建时间越早越靠前</a-select-option>
              <a-select-option :value="constant.sort.sale">销量越高越靠前</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="搜索框">
            <a-checkbox v-model="form.isSearchShow">是否搜索</a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="分组筛选">
            <a-checkbox v-model="form.isFilterShow">是否开启</a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="列表样式">
            <a-radio-group @change="onGoodsStyleChange" v-model="form.productGroupStyle" style="margin-top: 5px">
              <a-radio :value="constant.style.max">大图</a-radio>
              <a-radio :value="constant.style.min">小图</a-radio>
              <a-radio :value="constant.style.minix">大一两小</a-radio>
              <a-radio :value="constant.style.detail">详细列表</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="购买按钮">
            <a-checkbox v-model="form.isBtnShow">是否显示</a-checkbox>
            <a-radio-group v-if="form.isBtnShow" v-model="form.productGroupBtnStyle">
              <a-radio :value="constant.btnStyle.style1">样式1</a-radio>
              <a-radio :value="constant.btnStyle.style2">样式2</a-radio>
              <a-radio :value="constant.btnStyle.style3">样式3</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="form.productGroupStyle !== constant.style.detail" label="商品名">
            <a-checkbox v-model="form.isProductNameShow">是否显示</a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="价格">
            <a-checkbox v-model="form.isPriceShow">是否显示</a-checkbox>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <p-footer>
      <template #content>
        <a-button class="mr15">取消</a-button>
        <a-button @click="onSubmit" :loading="submitLoading" type="primary">保存</a-button>
      </template>
    </p-footer>
  </page>
</template>

<script>
import Page from '@/components/Page'
import ProductPreview from '@/components/decorate/ProductPreview'
import {SortOne} from '@icon-park/vue'
import ProductService from '@/service/product.service'
import common from '@/common/common'
import constant from '@/common/constant'

export default {
  name: 'ProductGroupEditPage',
  components: {
    Page,
    ProductPreview,
    SortOne
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      isUpdate: false,
      constant: constant.productGroup,
      form: {
        id: 0,
        name: '',
        productGroupStyle: constant.productGroup.style.max,
        productGroupBtnStyle: constant.productGroup.btnStyle.style3,
        isSearchShow: false,
        isFilterShow: false,
        isBtnShow: true,
        isPriceShow: true,
        isProductNameShow: false,
        productGroupSort1: constant.productGroup.sort.number,
        productGroupSort2: constant.productGroup.sort.dateAsc,
      },
      rules: {
        name: [{
          required: true,
          message: '请填写分组名称'
        }]
      }
    }
  },
  computed: {
    getTitle() {
      if (this.form.name.length === 0) {
        return '分组名称'
      } else {
        return this.form.name
      }
    }
  },
  created() {
    this.isUpdate = this.$route.path.indexOf('update') > -1
    if (this.isUpdate) {
      this.getModel()
    }
  },
  methods: {
    onGoodsStyleChange() {
      if (this.form.styleType === constant.productGroup.style.detail) {
        this.form.isProductNameShow = true
      }
    },
    getModel() {
      this.loading = true
      ProductService.getProductGroup({
        id: this.$route.query.id
      }).then(res => {
        this.loading = false
        this.form = res.data.result
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid === false) return
        this.submitLoading = true
        if (this.isUpdate) {
          ProductService.updateGroup(this.form).then(res => {
            this.submitLoading = false
            if (common.isSuccess(res)) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          ProductService.addGroup(this.form).then(res => {
            this.submitLoading = false
            if (common.isSuccess(res)) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
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

.preview-container {
  .search {
    margin: 5px 10px 0 10px;
  }

  .filter {
    background-color: white;
    display: flex;
    margin-top: 5px;
    padding: 10px 20px;
    font-size: 14px;
    justify-content: space-between;
  }
}
</style>
