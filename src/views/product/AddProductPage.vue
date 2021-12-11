<template>
    <div class="p-container">
        <a-form-model
                style="padding-bottom: 20px"
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
                <a-form-model-item label="商品名称" required prop="productTitle">
                    <a-input
                            v-model="model.productTitle"
                            @change="onChangeTitle"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="titleSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="商品类目" required>
                    <p-product-category-select v-model="model.productCategory" />
                </a-form-model-item>
                <a-form-model-item label="商品卖点">
                    <a-input
                            v-model="model.productSellPoint"
                            @change="onChangeSellPoint"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="sellPointSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="分享描述">
                    <a-input
                            v-model="model.productShareDescription"
                            @change="onChangeShare"
                            class="font-size-12"
                            style="max-width: 350px"
                            :suffix="shareSuffix"
                    />
                </a-form-model-item>
                <a-form-model-item label="商品主图" required>
                    <p-upload-cell
                            :cells.sync="model.productImages"
                            :upload-max="10"
                    />
                    <p class="font-size-12 text-muted">
                        尺寸建议750x750（正方形模式）或750×1000（长图模式）像素以上，大小2M以下，最多10张
                        (可拖拽图片调整显示顺序 )
                    </p>
                </a-form-model-item>
              <a-form-model-item label="销售区域">
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
                            :category-id="model.productCategory"
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
                    <a-button @click="onStepNext" type="primary" class="font-size-12"
                    >下一步
                    </a-button
                    >
                </div>
                <div v-if="step === 2">
                    <a-button @click="onStepPrev" class="p-input-right-5 font-size-12"
                    >上一步
                    </a-button
                    >
                    <a-button :ladoing="loading" @click="onSave" type="primary" class="font-size-12"
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
import limitSale from './UpdateProductLimit'
import FreightTemplateServiceAPI from '../../service/freightTemplateService'
import ProductServiceAPI from '../../service/product.service'
import WangEditor from 'wangeditor'

export default {
  name: 'AddProductPage',
  components: {
    'p-title': Title,
    'p-upload-cell': UploadCell,
    'p-material-upload-modal': MaterialUploadModal,
    'p-product-category-select': ProductCategorySelect,
    'p-sku-select': SkuSelect,
    'limit-sale': limitSale
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
      step: 1,
      loading:false,
      memberLevels: [],
      model: {
        productTitle: '',
        productSellPoint: '',
        productShareDescription: '',
        saleCategorySelect: 1,
        salePrice: '',
        memberPrice: '',
        costPrice: '',
        marketPrice: '',
        code: '',
        inventory: '',
        weight: '',
        volume: '',
        productImages: [],
        productCategory: 0,
        deliverySelect: ['1'],
        customServiceSelect: ['1', '2'],
        saleTimeSelect: '1',
        freightTemplateSelect: '',
        saleTime: null,
        sku: [],
        leastSaleCount: 1,
        limit: {
          isLimitIdentity: false,
          isLimitCount: false,
          isLifelongLimit: false,
          limitCount: 0,
          levels: [],
          cycleUnit: 'DAY'
        }
      },
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
        marketPrice: [
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
            pattern: pattern.decimal2,
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
      freightTemplateList: []
    }
  },
  computed: {
    titleSuffix() {
      return `${this.model.productTitle.length}/60`
    },
    sellPointSuffix() {
      return `${this.model.productSellPoint.length}/60`
    },
    shareSuffix() {
      return `${this.model.productShareDescription.length}/36`
    },
    priceDisabled() {
      return this.model.sku.length === 0;
    },
    freightTemplateDisabled() {
      let mode = constant.freightModel.merchantFreight.toString()
      return this.model.deliverySelect.findIndex((x) => x === mode) > -1
    },
  },
  created() {
    this.getFreightTemplate()
  },
  methods: {
    onSave() {
      if (this.$refs.skuSelect.validate() === false) return
      this.$refs.model.validate((isSuccess) => {
        if (this.$refs.limit.validate() && isSuccess) {
          let req = this.modelToRequest()
          this.loading = true
          ProductServiceAPI.add(req).then((res) => {
            if (util.isSuccess(res)) {
              this.loading = false
              this.$message.success({
                content: '保存成功',
                onClose: () => {
                  this.$router.back();
                },
              })
            }
          })
        }
      })
    },
    modelToRequest() {
      let freightMode = constant.freightModel;
      let csMode = constant.rebateConstant.mode;
      let request = {
        title: this.model.productTitle,
        saleArea:this.model.saleArea,
        sellPointDesc: this.model.productSellPoint,
        saleCategory: this.model.saleCategorySelect,
        shareDesc: this.model.productShareDescription,
        imageUrl: this.model.productImages.join(','),
        detailUrl: this.editor.txt.html(),
        categoryId: this.model.productCategory,
        initSaleCount: 0,
        freightTemplateId: this.model.freightTemplateSelect,
        productStatus: this.model.saleTimeSelect,
        minimumSaleCount: this.model.leastSaleCount,
        isMerchantFreight:
          this.model.deliverySelect.filter((x) => x === freightMode.merchantFreight.toString()).length > 0,
        isSendFreight:
          this.model.deliverySelect.filter((x) => x === freightMode.sendFreight.toString()).length > 0,
        isExchangeService:
          this.model.customServiceSelect.filter((x) => x === csMode.exchange.toString()).length > 0,
        isRebateService:
          this.model.customServiceSelect.filter((x) => x === csMode.rebate.toString()).length > 0,
      };
      if (this.model.sku.length > 0) {
        request.skuItems = this.$refs.skuSelect.getFields().map((f) => {
          return {
            id: f.id,
            salePrice: f.salePrice,
            costPrice: f.costPrice,
            imageUrl: f.image,
            marketPrice: f.marketPrice,
            memberPrice: f.memberPrice,
            code: f.code,
            weight: f.weight,
            volume: f.volume,
            inventory: f.inventory,
            attrItems: f.skuValues.map((a) => {
              return {
                attrId: a.skuId,
                valueId: a.skuValueId,
              }
            }),
          }
        })
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
            inventory: this.model.inventory.toDecimal(),
            attrItems: [],
          },
        ];
      }
      request.limitSaleConfig = {
        isLimitCount: this.model.limit.isLimitCount,
        isLifelongLimit: this.model.limit.isLifelongLimit,
        cycleUnit: this.model.limit.cycleUnit,
        count: this.model.limit.limitCount,
        isSpecific: this.model.limit.isLimitIdentity,
        levelLimit: this.model.limit.levels.map(x => x.toString()).join(',')
      }
      return request;
    },
    validate() {
      if (this.model.productImages.length === 0) {
        this.$message.error('请选择商品主图');
        return false;
      }
      if (this.model.productCategory === 0) {
        this.$message.error('请选择商品类目');
        return false;
      }
      return true;
    },
    onChangeTitle() {
      if (this.model.productTitle.length > 60) {
        this.model.productTitle = this.model.productTitle.substring(0, 60);
      }
    },
    onChangeSellPoint() {
      if (this.model.productSellPoint.length >= 60) {
        this.model.productSellPoint = this.model.productSellPoint.substring(
          0,
          60
        );
      }
    },
    onChangeShare() {
      if (this.model.productShareDescription.length >= 60) {
        this.model.productShareDescription = this.model.productShareDescription.substring(
          0,
          60
        );
      }
    },
    getFreightTemplate() {
      FreightTemplateServiceAPI.list().then((res) => {
        this.freightTemplateList = res.data.result.page.list.map((x) => {
          return {
            id: x.id,
            name: x.name,
          };
        });
      });
    },
    onChangeSkuSelect(sku) {
      this.model.sku = sku;
    },
    onStepNext() {
      if (this.$refs.skuSelect.validate() === false) return;
      this.$refs.model.validate((isSuccess) => {
        if (this.$refs.limit.validate() && isSuccess) {
          this.step += 1;
          if (this.editor === null) {
            this.editor = new WangEditor('#edit');
            this.editor.customConfig.uploadImgServer =
              process.env.VUE_APP_UPLOAD_URL;
            this.editor.uploadImgMaxLength = 1;
            this.editor.customConfig.uploadFileName = 'file';
            this.editor.customConfig.uploadImgHooks = {
              customInsert(insert, res) {
                insert(res.result.url);
              },
            };
            this.editor.create();
          }
        }
      })
    },
    onStepPrev() {
      this.step += -1;
    },
  }
}
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
