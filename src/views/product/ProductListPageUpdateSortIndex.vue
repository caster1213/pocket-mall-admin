<template>
    <a-popover :visible="visible" placement="right" trigger="click">
        <template slot="content">
            <a-input v-model.number="value" style="width: 80px" />
            <a-button @click="update" type="link" class="ml10 text-action-btn">确认
            </a-button>
            <a-button @click="visible = false" type="link" class="text-action-btn">取消
            </a-button>
        </template>
        <a-icon @click="visible = true" style="font-size: 13px;cursor: pointer" type="edit" />
    </a-popover>
</template>

<script>
import ProductService from '../../service/product.service'

export default {
  name: 'ListUpdateSortIndex',
  props: {
    index: Number,
    id: Number
  },
  data() {
    return {
      visible: false,
      value: this.index
    }
  },
  methods: {
    update() {
      ProductService.updateIndex({
        id: this.id,
        index: this.value
      }).then(res => {
        this.$emit('complete', {
          value: this.value,
          id: this.id
        })
        this.$message.success('保存成功')
        this.visible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
