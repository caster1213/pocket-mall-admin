<template>
    <div v-if="isPageLoad" class="p-container">
        <a-form-model
                v-show="step === 1"
                ref="model"
                :model="model"
                :rules="rules"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 18 }"
        >
            <p-title title="商品类型" />
            <div class="p-box">
                <div class="sale-category-select">
                    <div @click="model.saleCategorySelect = 1"
                         :class="{'sale-category-select-item-active':model.saleCategorySelect === 1}"
                         class="sale-category-select-item">
                        <div>实物商品</div>
                        <div class="tag">(物流发货)</div>
                    </div>
                    <div @click="model.saleCategorySelect = 2"
                         :class="{'sale-category-select-item-active':model.saleCategorySelect === 2}"
                         class="sale-category-select-item">
                        <div>加盟商品</div>
                        <div class="tag">(物流发货)</div>
                    </div>
                </div>
            </div>
            <p-title title="基本信息" />
            <div class="p-box">
                <a-form-model-item label="商品名称" required prop="title">
                    <a-input
                            v-model="model.title"
                            @change="onChangeTitle"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="titleSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="商品类目" required>
                    <p-product-category-select v-model="model.categoryId" />
                </a-form-model-item>
                <a-form-model-item label="商品卖点">
                    <a-input
                            v-model="model.sellPointTitle"
                            @change="onChangeSellPoint"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="sellPointSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="分享描述">
                    <a-input
                            v-model="model.shareTitle"
                            @change="onChangeShare"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="shareSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="商品主图" required>
                    <p-upload-cell :cells.sync="model.images" :upload-max="10" />
                    <p class="font-size-12 text-muted">
                        尺寸建议750x750（正方形模式）或750×1000（长图模式）像素以上，大小2M以下，最多10张
                        (可拖拽图片调整显示顺序 )
                    </p>
                </a-form-model-item>
              <a-form-model-item label="销售区域" prop="saleArea">
                <a-select style="width:120px" v-model="model.saleArea">
                  <a-select-option :value="0">默认区</a-select-option>
                  <a-select-option :value="1">售卖区</a-select-option>
                  <a-select-option :value="2">特价区</a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <p-title title="价格库存" />
            <div class="p-box">
                <a-form-model-item label="商品规格" required>
                    <p-sku-select
                            v-model="model.sku"
                            ref="skuSelect"
                            :category-id="model.categoryId"
                            @change="onChangeSkuSelect"
                    />
                </a-form-model-item>
                <a-form-model-item
                        v-if="priceDisabled"
                        label="价格"
                        required
                        prop="salePrice"
                >
                    <a-input
                            v-model="model.salePrice"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item
                        v-if="priceDisabled"
                        label="库存"
                        required
                        prop="inventory"
                >
                    <a-input
                            v-model="model.inventory"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item
                        v-if="priceDisabled"
                        label="划线价"
                        prop="marketPrice"
                >
                    <a-input
                            v-model="model.marketPrice"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item
                        v-if="priceDisabled"
                        label="会员价"
                        prop="memberPrice"
                >
                    <a-input
                            v-model="model.memberPrice"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item v-if="priceDisabled" label="成本价" prop="costPrice">
                    <a-input
                            v-model="model.costPrice"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item v-if="priceDisabled" label="重量" prop="weight">
                    <a-input
                            v-model="model.weight"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item v-if="priceDisabled" label="体积" prop="volume">
                    <a-input
                            v-model="model.volume"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
                <a-form-model-item v-if="priceDisabled" label="商家编码">
                    <a-input
                            v-model="model.code"
                            class="font-size-12"
                            style="max-width: 150px"
                    />
                </a-form-model-item>
            </div>
            <p-title title="配送信息" />
            <div class="p-box">
                <a-form-model-item label="配送方式" required prop="deliverySelect">
                    <a-checkbox-group v-model="model.deliverySelect">
                        <a-checkbox value="1">快递发货</a-checkbox>
                        <a-checkbox value="2">上门自提</a-checkbox>
                    </a-checkbox-group>
                </a-form-model-item>
                <a-form-model-item
                        v-if="freightTemplateDisabled"
                        label="运费模板"
                        prop="freightTemplateSelect"
                >
                    <a-select
                            v-model="model.freightTemplateSelect"
                            style="max-width: 350px"
                    >
                        <a-select-option
                                v-for="option in freightTemplateList"
                                :key="option.id"
                                :value="option.id"
                        >
                            {{ option.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
            <p-title title="其他信息" />
            <div class="p-box">
                <a-form-model-item label="开售时间" prop="saleTimeSelect">
                    <a-radio-group
                            v-model="model.saleTimeSelect"
                            style="margin-top: 8px"
                            class="radio-list"
                    >
                        <a-radio value="1">立即开售</a-radio>
                        <a-radio value="2">
                            <span class="mr10">定时开售</span>
                            <a-date-picker
                                    v-model="model.saleTime"
                                    placeholder="请选择开售日期"
                                    foramt="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                            />
                        </a-radio>
                        <a-radio value="3">放入仓库</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="售后服务">
                    <a-checkbox-group v-model="model.customServiceSelect">
                        <a-checkbox value="1">支持7天无理由退货</a-checkbox>
                        <a-checkbox value="2">支持买家申请换货</a-checkbox>
                    </a-checkbox-group>
                </a-form-model-item>
                <a-form-model-item label="限购">
                    <limit-sale ref="limit" v-model="model.limit" />
                </a-form-model-item>
                <a-form-model-item label="起售" prop="leastSaleCount">
                    <div class="font-size-12">
                        <span>商品至少</span>
                        <a-input-number v-model="model.leastSaleCount" style="margin: 0 5px" />
                        <span>件起售</span>
                    </div>
                    <div class="font-size-12 gray-7">
                        起售数量超出商品库存时，买家无法购买该商品。
                    </div>
                </a-form-model-item>
            </div>
        </a-form-model>
        <a-row
                v-show="step === 2"
                style="height: 100%"
                type="flex"
                justify="center"
        >
            <div style="width: 100%; height: 100%" id="edit"></div>
        </a-row>
        <p-footer>
            <template #content>
                <div v-if="step === 1">
                    <a-button @click="onStepNext" type="primary" class="font-size-12">
                        下一步
                    </a-button>
                </div>
                <div v-if="step === 2">
                    <a-button @click="onStepPrev" class="p-input-right-5 font-size-12"
                    >上一步
                    </a-button
                    >
                    <a-button :loading="loading" @click="onSave" type="primary" class="font-size-12"
                    >保存
                    </a-button
                    >
                </div>
            </template>
        </p-footer>
    </div>
</template>
<script>
import Title from '../../components/Title'
import UploadCell from '../../components/material/UploadCell'
import MaterialUploadModal from '../../components/material/MaterialUploadModal'
import ProductCategorySelect from './ProductCategorySelect'
import SkuSelect from '../../components/sku/SkuSelectl'
import pattern from '../../common/pattern'
import constant from '../../common/constant'
import util from '../../common/common'
import FreightTemplateServiceAPI from '../../service/freightTemplateService'
import ProductServiceAPI from '../../service/product.service'
import ProductEntity from './model'
import UpdateProductLimit from './UpdateProductLimit'
import WangEditor from 'wangeditor'

export default {
  name: 'UpdateProductPage',
  components: {
    'p-title': Title,
    'p-upload-cell': UploadCell,
    'p-material-upload-modal': MaterialUploadModal,
    'p-product-category-select': ProductCategorySelect,
    'p-sku-select': SkuSelect,
    'limit-sale': UpdateProductLimit
  },
  data() {
    let validateLeastCount = (rule, value, callback) => {
      let q = this.$refs.limit.getFields()
      let limit = parseInt(q.limitCount)
      if (value > limit) {
        callback(new Error('起售数量不能大于限购数量'))
      } else {
        callback()
      }
    }
    return {
      editor: null,
      model: new ProductEntity(),
      isPageLoad: false,
      loading: false,
      step: 1,
      rules: {
        productTitle: [
          {required: true, message: '请填写商品标题', trigger: 'change'},
        ],
        salePrice: [
          {required: true, message: '请填写商品价格', trigger: 'change'},
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        memberPrice: [
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        marketPrice: [
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        costPrice: [
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        inventory: [
          {required: true, message: '请填写商品库存', trigger: 'change'},
          {
            pattern: pattern.decimal0,
            message: '请输入正确的数字',
            trigger: 'change',
          },
        ],
        weight: [
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        volume: [
          {
            pattern: pattern.decimal2,
            message: '请输入正确的数字，小数点最多保留2位',
            trigger: 'change',
          },
        ],
        deliverySelect: [
          {
            required: true,
            message: '至少选择一种配送方式',
            trigger: 'change',
          },
        ],
        saleTimeSelect: [
          {required: true, message: '请选择开售时间', trigger: 'change'},
        ],
        freightTemplateSelect: [
          {required: true, message: '请选择运费模板', trigger: 'change'},
        ],
        leastSaleCount: [
          {validator: validateLeastCount, trigger: 'change'}
        ]
      },
      freightTemplateList: [],
    };
  },
  computed: {
    titleSuffix() {
      return `${this.model.title.length}/60`;
    },
    sellPointSuffix() {
      return `${this.model.sellPointTitle.length}/60`;
    },
    shareSuffix() {
      return `${this.model.shareTitle.length}/36`;
    },
    priceDisabled() {
      return this.model.sku.length === 0;
    },
    freightTemplateDisabled() {
      let mode = constant.freightModel.merchantFreight.toString();
      console.log(this.model.deliverySelect.findIndex((x) => x === mode));
      return this.model.deliverySelect.findIndex((x) => x === mode) > -1;
    },
  },
  created() {
    this.getFreightTemplate();
    this.getData();
  },
  methods: {
    onSave() {
      this.loading = true
      ProductServiceAPI.update(this.modelToRequest()).then((res) => {
        this.loading = false
        if (util.isSuccess(res)) {
          this.$message.success({
            content: '保存成功',
            onClose: () => {
              this.$router.push('/product');
            },
          })
        } else {
          this.$message.error(res.data.msg)
        }
      });
    },
    getData() {
      ProductServiceAPI.get({id: this.$route.query.id}).then((res) => {
        if (util.isSuccess(res)) {
          let data = res.data.result
          this.isPageLoad = true
          this.model.id = data.id
          this.model.title = data.title
          this.model.saleArea = data.saleArea
          this.model.saleCategorySelect = data.saleCategory
          this.model.images = data.images
          this.model.detail = data.detailUrl
          this.model.sellPointTitle = data.sellPointDesc
          this.model.shareTitle = data.shareDesc
          this.model.categoryId = data.categoryId
          if (data.isMerchantFreight) {
            this.model.deliverySelect.push(
              constant.freightModel.merchantFreight.toString()
            );
          }
          if (data.isSendFreight) {
            this.model.deliverySelect.push(
              constant.freightModel.sendFreight.toString()
            );
          }
          this.model.freightTemplateSelect = data.freightTemplateId.toString()
          this.model.saleTimeSelect = data.productStatus.toString()
          if (data.isRebateService) {
            this.model.customServiceSelect.push(
              constant.rebateConstant.mode.rebate.toString()
            );
          }
          if (data.isExchangeService) {
            this.model.customServiceSelect.push(
              constant.rebateConstant.mode.exchange.toString()
            );
          }
          let rows = data.skuPrices
          let cells = rows[0].skuAttributeMappers
          if (rows.length === 1 && cells.length === 0) {
            this.model.salePrice = rows[0].salePrice.toDecimalString()
            this.model.memberPrice = rows[0].memberPrice.toDecimalString()
            this.model.costPrice = rows[0].costPrice.toDecimalString()
            this.model.marketPrice = rows[0].marketPrice.toDecimalString()
            this.model.inventory = rows[0].inventory.toString()
            this.model.image = rows[0].image
            this.model.code = rows[0].code
          } else {
            this.model.sku = rows.map((row) => {
              return {
                id: row.id,
                salePrice: row.salePrice,
                memberPrice: row.memberPrice,
                costPrice: row.costPrice,
                marketPrice: row.marketPrice,
                image: row.imageUrl === null ? '' : row.imageUrl,
                code: row.code,
                weight: row.weight,
                volume: row.volume,
                inventory: row.inventory,
                skuList: row.skuAttributeMappers.map((a) => {
                  return {
                    skuId: a.skuAttrId.toString(),
                    skuName: a.skuAttrName,
                    skuValueId: a.skuAttrValueId.toString(),
                    skuValue: a.skuAttrValue,
                  };
                }),
              };
            });
          }
          this.model.limit = {
            isLifelongLimit: data.limitSaleConfig.isLifelongLimit,
            isLimitCount: data.limitSaleConfig.isLimitCount,
            isLimitIdentity: data.limitSaleConfig.isLimitIdentity,
            cycleUnit: data.limitSaleConfig.cycleUnit,
            limitCount: data.limitSaleConfig.count,
            levels: data.limitSaleConfig.levelLimit.split(',')
          }
        }
      });
    },
    modelToRequest() {
      let freightMode = constant.freightModel;
      let csMode = constant.rebateConstant.mode;
      let request = {
        id: this.model.id,
        title: this.model.title,
        saleArea:this.model.saleArea,
        saleCategory: this.model.saleCategorySelect,
        sellPointDesc: this.model.sellPointTitle,
        shareDesc: this.model.shareTitle,
        imageUrl: this.model.images.join(','),
        detailUrl: this.editor.txt.html(),
        categoryId: this.model.categoryId,
        initSaleCount: 0,
        freightTemplateId: this.model.freightTemplateSelect,
        productStatus: this.model.saleTimeSelect,
        minimumSaleCount: this.model.leastSaleCount,
        isMerchantFreight:
          this.model.deliverySelect.filter(
            (x) => x === freightMode.merchantFreight.toString()
          ).length > 0,
        isSendFreight:
          this.model.deliverySelect.filter(
            (x) => x === freightMode.sendFreight.toString()
          ).length > 0,
        isExchangeService:
          this.model.customServiceSelect.filter(
            (x) => x === csMode.exchange.toString()
          ).length > 0,
        isRebateService:
          this.model.customServiceSelect.filter(
            (x) => x === csMode.rebate.toString()
          ).length > 0,
      };
      if (this.model.sku.length > 0) {
        request.skuItems = this.$refs.skuSelect.getFields().map((f) => {
          return {
            id: f.id,
            salePrice: f.salePrice,
            costPrice: f.costPrice,
            memberPrice: f.memberPrice,
            imageUrl: f.image,
            marketPrice: f.marketPrice,
            code: f.code,
            weight: f.weight,
            volume: f.volume,
            inventory: f.inventory,
            attrItems: f.skuValues.map((a) => {
              return {
                attrId: a.skuId,
                valueId: a.skuValueId,
              };
            }),
          };
        });
      } else {
        request.skuItems = [
          {
            salePrice: this.model.salePrice.toDecimal(),
            costPrice: this.model.costPrice.toDecimal(),
            marketPrice: this.model.marketPrice.toDecimal(),
            memberPrice: this.model.memberPrice.toDecimal(),
            code: this.model.code,
            weight: this.model.weight.toDecimal(),
            volume: this.model.volume.toDecimal(),
            inventory: this.model.inventory,
            attrItems: [],
          },
        ]
      }
      request.limitSaleConfig = {
        isLimitCount: this.model.limit.isLimitCount,
        isLifelongLimit: this.model.limit.isLifelongLimit,
        cycleUnit: this.model.limit.cycleUnit,
        count: this.model.limit.limitCount,
        isSpecific: this.model.limit.isLimitIdentity,
        levelLimit: this.model.limit.levels.map(x => x.toString()).join(',')
      }
      return request
    },
    validate() {
      if (this.model.images.length === 0) {
        this.$message.error('请选择商品主图');
        return false;
      }
      if (this.model.categoryId === 0) {
        this.$message.error('请选择商品类目');
        return false;
      }
      return true;
    },
    onChangeTitle() {
      if (this.model.title.length > 60) {
        this.model.title = this.model.title.substring(0, 60);
      }
    },
    onChangeSellPoint() {
      if (this.model.sellPointTitle.length >= 60) {
        this.model.sellPointTitle = this.model.sellPointTitle.substring(0, 60);
      }
    },
    onChangeShare() {
      if (this.model.shareTitle.length >= 60) {
        this.model.shareTitle = this.model.shareTitle.substring(0, 60);
      }
    },
    getFreightTemplate() {
      FreightTemplateServiceAPI.list().then((res) => {
        this.freightTemplateList = res.data.result.page.list.map((x) => {
          return {
            id: x.id.toString(),
            name: x.name,
          };
        });
      });
    },
    onChangeSkuSelect(sku) {
      this.model.sku = sku;
      console.log(sku);
    },
    onStepNext() {
      if (this.$refs.skuSelect.validate() === false) return;
      this.$refs.model.validate((isSuccess) => {
        if (isSuccess && this.$refs.limit.validate()) {
          this.step += 1;
          if (this.editor === null) {
            this.editor = new WangEditor('#edit')
            this.editor.customConfig.uploadImgServer =
              process.env.VUE_APP_UPLOAD_URL
            this.editor.uploadImgMaxLength = 1
            this.editor.customConfig.uploadFileName = 'file'
            this.editor.customConfig.uploadImgHooks = {
              customInsert(insert, res) {
                insert(res.result.url);
              },
            };
            this.editor.create();
            this.editor.txt.html(this.model.detail);
          }
        }
      })
    },
    onStepPrev() {
      this.step += -1;
    },
  },
};
</script>

<style lang="less" scoped>
    @import "../../assets/css/color.css";

    /deep/ .ant-input-affix-wrapper input {
        padding-right: 50px !important;
    }

    /deep/ .ant-input-suffix {
        color: #ccc;
    }

    .sale-category-select {
        display: flex;
        margin-left: -10px;

        .sale-category-select-item {
            position: relative;
            border: 1px solid #cacaca;
            margin-right: 10px;
            padding: 5px 0;
            width: 115px;
            text-align: center;
            cursor: pointer;
            border-radius: 2px;

            .tag {
                color: #999;
                font-size: 14px;
                margin-top: 1px;
            }
        }

        .sale-category-select-item-active {
            border-color: #155bd4 !important;

            &:after {
                content: "";
                display: inline-block;
                position: absolute;
                width: 24px;
                height: 24px;
                right: -1px;
                bottom: -1px;
                background: url("../../assets/img/border-active.png") no-repeat;
                background-size: 24px auto;
            }
        }
    }
</style>
