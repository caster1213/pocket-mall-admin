<template>
  <a-table @change="onPageChange" :columns="columns" :data-source="goods" row-key="id"></a-table>
</template>

<script>
import query from '../mixin/query'

export default {
  name: "GoodsSelectPickerResult",
  mixins: [query],
  props: {
    isShowLink: {
      type: Boolean,
      default: false
    },
    goods: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      columns: [{
        title: '商品',
        customRender: (value, row) => {
          let imageUrl = row.imageUrl.split(',')[0]
          let link = this.isShowLink ? <a className="line1">{row.title}</a> : <span className="line1">{row.title}</span>
          return (<a-row type="flex">
            <div>
              <img width="60px" height="60px" src={imageUrl}/>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: space-around;" class="ml10">
              <div style="width:150px">
                {link}
              </div>
              <span style="font-weight:700;color:#ed6a0c">¥{value.minSalePrice}</span>
            </div>
          </a-row>)
        }
      }, {
        title: '规格',
        customRender: () => {
          return '-'
        }
      }, {
        title: '操作',
        customRender: (value, row) => {
          return <a-button onClick={() => {
            this.onDelete(row)
          }} type="link" class="text-action-btn">删除</a-button>
        }
      }]
    }
  },
  methods: {
    onDelete(row) {
      this.$emit('delete', row)
    }
  }
}
</script>

<style scoped>

</style>
