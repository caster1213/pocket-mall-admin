<template>
  <div class="goods-preview">
    <div class="goods-preview-style-large">
      <div class="large-item">
        <div class="image"></div>
        <div class="info">
          <div class="title"></div>
          <div class="sale-price">
            <div>
              <span class="symbol">¥</span>
              <span class="text">{{ price.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="large-item">
        <div class="image"></div>
        <div class="info">
          <div class="title"></div>
          <div class="sale-price">
            <div>
              <span class="symbol">¥</span>
              <span class="text">{{ price.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="large-item">
        <div class="image"></div>
        <div class="info">
          <div class="title"></div>
          <div class="sale-price">
            <div>
              <span class="symbol">¥</span>
              <span class="text">{{ price.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductPreview",
  props: {
    styleType: {
      type: String,
      default: 'large'
    },
    title: {
      type: Object,
      default: () => {
        return {
          visible: false,
          value: '这里显示商品名称，最多显示一行'
        }
      }
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
    buyBtn: {
      type: Object,
      default: () => {
        return {
          visible: false,
          value: 1
        }
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.goods-preview {
  .info {
    padding: 10px;

    .title {

    }

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

      .btn {

      }
    }
  }
}

.goods-preview-style-large {
  width: 100%;

  .large-item {
    width: 100%;
    background-color: white;
    margin-bottom: 10px;

    .image {
      width: 100%;
      background: url("../../assets/img/image-preview.png") no-repeat 50%;
      background-size: cover;
      height: 290px;
    }
  }
}
</style>