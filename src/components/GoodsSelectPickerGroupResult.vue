<template>
  <a-table @change="onPageChange" :columns="columns" :data-source="list" row-key="id"></a-table>
</template>

<script>
import pagination from '@/mixin/query'

export default {
  name: "GoodsSelectPickerGroupResult",
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mixins:[pagination],
  data() {
    return {
      columns: [{
        title: '分组名称',
        dataIndex: 'name',
        width: 300
      }, {
        title: '商品数量',
        dataIndex: 'productTotal'
      }, {
        title: '操作',
        customRender: (value, row) => {
          return <a-button onClick={() => {
            this.onDeleteSelectRow(row)
          }} class="text-action-btn" type="link">删除</a-button>
        }
      }]
    }
  },
  methods: {
    onDeleteSelectRow(row) {
      this.$emit('delete', row)
    }
  }
}
</script>

<style scoped>

</style>
