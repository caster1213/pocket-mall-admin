<template>
  <div class="goods-preview">
    <div :class="previewClassName">
      <div v-for="n in count" :key="n" class="goods-item">
        <div class="goods-item-container">
          <div class="image"></div>
          <div class="info">
            <div v-if="isGoodsName" class="title">最多显示一行文字</div>
            <div class="sale-box">
              <div class="sale-price">
                <div v-show="isPriceShow">
                  <span class="symbol">¥</span>
                  <span class="text">{{ price.value }}</span>
                </div>
              </div>
              <div v-if="isShowBtn" class="btn">
                <buy v-if="btnStyle === btnStyleConstant.style1" theme="outline" size="18" fill="#f44" />
                <add-one v-else-if="btnStyle === btnStyleConstant.style2" theme="outline" size="18" fill="#f44" />
                <a-button type="danger" v-else>马上抢</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Buy, AddOne} from '@icon-park/vue'
import constant from '@/common/constant'

export default {
  name: 'ProductPreview',
  components: {
    Buy,
    AddOne
  },
  props: {
    styleType: {
      type: Number,
      default: constant.productGroup.style.max
    },
    btnStyle: {
      type: Number,
      default: constant.productGroup.btnStyle.style3
    },
    price: {
      type: Object,
      default: () => {
        return {
          visible: false,
          value: '99'
        }
      }
    },
    isShowBtn: {
      type: Boolean,
      default: true
    },
    isGoodsName: {
      type: Boolean,
      default: false
    },
    isPriceShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      styleConstant:constant.productGroup.style,
      btnStyleConstant:constant.productGroup.btnStyle
    }
  },
  computed: {
    previewClassName() {
      if (this.styleType === constant.productGroup.style.max) {
        return {
          'goods-preview-style-large': true
        }
      } else if (this.styleType === constant.productGroup.style.min) {
        return {
          'goods-preview-style-min': true
        }
      } else if (this.styleType === constant.productGroup.style.minix) {
        return {
          'goods-preview-style-minix': true
        }
      } else {
        return {
          'goods-preview-style-list': true
        }
      }
    },
    count() {
      return this.styleType === constant.productGroup.style.min ? 4 : 3
    }
  }
}
</script>

<style lang="less" scoped>
.goods-preview {

}

.goods-preview-style-large {
  width: 100%;
}

.goods-preview-style-min {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .goods-item {
    width: 50%;
    box-sizing: border-box;

    .goods-item-container {
      margin: 0 5px;
    }

    .image {
      height: 140px;
    }
  }
}

.goods-preview-style-minix {

  display: flex;
  flex-wrap: wrap;

  .goods-item:nth-child(1) {
    width: 100%;
  }

  .goods-item:nth-child(1) ~ div {
    width: 50%;

    .goods-item-container {
      margin: 0 5px;
    }

    .image {
      height: 140px;
    }
  }
}

.goods-preview-style-list {
  .goods-item {
    width: 100%;

    .goods-item-container {
      display: flex;
      margin: 5px;

      .image {
        width: 50%;
        height: 145px;
      }

      .info {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}

.goods-item {
  width: 100%;
  margin-bottom: 10px;

  .goods-item-container {
    background-color: white;

    .info {
      padding: 10px;

      .title {

      }

      .sale-box {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 10px;

        .sale-price {
          display: flex;
          justify-content: space-between;

          .symbol {
            color: #f44;
            font-size: 12px;
            margin-right: 2px;
          }

          .text {
            color: #f44;
            font-size: 16px;
          }


        }

        .btn {
          .ant-btn {
            border-radius: 12px;
            height: 24px;
            line-height: 22px;
            font-size: 12px;
            padding: 0 7px;
          }
        }
      }
    }
  }

  .image {
    width: 100%;
    background: url("../../assets/img/image-preview.png") no-repeat 50%;
    background-size: cover;
    height: 290px;
  }
}
</style>
