<template>
  <page>
    <a-alert
        message="若参与活动的商品设置了定时下架，则下架时间后该商品将无法购买。"
        type="info"
        show-icon
    />
    <p-title style="margin-top: 25px;" title="基础设置" type="line"/>
    <div class="p-box">
      <a-form-model :model="model" :rules="modelRule" ref="model"
                    :label-col="{span:2}"
                    :wrapper-col="{ span: 10 }">
        <a-form-model-item required label="活动名称" prop="name">
          <a-input v-model="model.name" style="width: 180px"/>
        </a-form-model-item>
        <a-form-model-item required label="活动时间" prop="selectDate">
          <a-range-picker :disabledDate="disableDate" v-model="model.selectDate" style="width: 420px"
                          show-time/>
        </a-form-model-item>
        <a-form-model-item required label="套餐商品">
          <a-button @click="selectGoodsPickerVisible = true" class="text-action-btn" type="link">选择商品
          </a-button>
          <a-table v-show="selectGoods.length>0" row-key="id" :pagination="false" :columns="goodsColumns"
                   :data-source="selectGoods"></a-table>
        </a-form-model-item>
        <a-form-model-item required label="套餐价格" prop="price">
          <a-input v-model="model.price" addon-before="¥" style="width: 180px"/>
        </a-form-model-item>
        <a-form-model-item required label="套餐主图">
          <p-upload-cell
              :cells="uploadImage"
              :upload-max="1"
          />
          <p class="font-size-12 text-muted">
            用于活动海报展示，建议尺寸 800 * 800 px
          </p>
        </a-form-model-item>
        <a-form-model-item required label="优惠叠加" prop="activityOverlay">
          <a-radio-group v-model="model.activityOverlay" style="margin-top: 8px" class="radio-list">
            <a-radio :value="1">不叠加其他营销活动</a-radio>
            <a-radio :value="2">叠加其他营销活动</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </div>
    <p-footer>
      <template #content>
        <a-button @click="onSubmit" class="mr10" type="primary">保存</a-button>
        <a-button>取消</a-button>
      </template>
    </p-footer>
    <p-goods-select-pricker :visible="selectGoodsPickerVisible" :select-goods-rows="selectGoods"
                            @close="selectGoodsPickerVisible = false" @confirm="onGoodsSelectChange"/>
  </page>
</template>

<script>
import Title from '../../../components/Title'
import UploadCell from '../../../components/material/UploadCell'
import MaterialUploadModal from '../../../components/material/MaterialUploadModal';
import Page from '../../../components/Page'
import DiscountPackageService from '../../../service/discount.package.service'
import moment from 'moment';
import common from '../../../common/common';
import pattern from '../../../common/pattern';

export default {
  name: 'PackageDiscountActivityAddPage',
  components: {
    Page,
    'p-upload-cell': UploadCell,
    'p-material-upload-modal': MaterialUploadModal,
    'p-title': Title
  },
  data() {
    return {
      submitLoading: false,
      pageLoading: false,
      selectGoods: [],
      uploadImage: [],
      selectGoodsPickerVisible: false,
      goodsColumns: [{
        title: '商品名称',
        dataIndex: 'productTitle',
        width: '200px',
        customRender: (value, row) => {
          return (
              <a-row type="flex">
                <a-col>
                  <img height="40" width="40" src={row.image}/>
                </a-col>
                <a-col class="ml10" span={15}>
                  <a-row type="flex" justify="space-between">
                    <div class="line1">{value}</div>
                    <div>¥{row.price}</div>
                  </a-row>
                </a-col>
              </a-row>
          )
        }
      }, {
        title: '参与规格',
        customRender: () => {
          return '-'
        }
      }, {
        title: '搭配数量',
        dataIndex: 'count',
        customRender: (value, row) => {
          return <a-input-number min={1} style="width:60px" v-model={row.count}/>
        }
      }, {
        title: '操作',
        customRender: (val, row, index) => {
          return <a-button onClick={() => {
            this.onDeleteSelectGoods(index)
          }} type="link" class="text-action-btn">删除</a-button>
        }
      }],
      model: {
        name: '',
        price: '',
        image: '',
        goodsList: [],
        selectDate: [],
        activityOverlay: 1
      },
      modelRule: {
        'name': [{
          required: true,
          message: '必须填写活动名称'
        }],
        'price': [{
          required: true,
          message: '必须填写套餐价格'
        }, {
          pattern: pattern.decimal2,
          message: '请填写正确的价格，小数点最多保留2位'
        }],
        'selectDate': [{
          required: true,
          message: '必须填写活动时间'
        }]
      }
    }
  },
  methods: {
    disableDate(current) {
      let now = moment(new Date())
      return now.isAfter(current, 'day')
    },
    onGoodsSelectChange(e) {
      this.selectGoodsPickerVisible = false
      this.selectGoods = e.map(ele => {
        return {
          id: ele.id,
          image: ele.imageUrl.split(',')[0],
          price: ele.minSalePrice,
          productTitle: ele.title,
          count: 1
        }
      })
    },
    onDeleteSelectGoods(index) {
      this.selectGoods.splice(index, 1)
    },
    onSubmit() {
      this.$refs.model.validate((valid) => {
        if (valid === false) return
        if (this.selectGoods.length === 0) {
          this.$message.warning('请选择商品');
          return;
        }
        if (this.uploadImage.length === 0) {
          this.$message.warning('请选择套餐主图');
          return;
        }
        let totalPrice = this.selectGoods.reduce((total, cur) => {
          total += cur.price * cur.count
          return total
        }, 0)
        if (this.model.price >= parseFloat(totalPrice)) {
          this.$message.warning('套餐价格不能低于商品的原价');
          return;
        }
        this.model.image = this.uploadImage[0]
        this.model.goodsList = this.selectGoods.map(ele => {
          return {
            productId: ele.id,
            skuId: -1,
            count: ele.count
          }
        })
        this.submitLoading = true
        DiscountPackageService.add(this.model).then(res => {
          this.submitLoading = false
          if (common.isSuccess(res)) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })

      })
    },
    load() {

    }
  }
}
</script>

<style scoped>

</style>
