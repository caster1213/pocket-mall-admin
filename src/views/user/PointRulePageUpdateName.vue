<template>
  <a-modal :visible="visible" @cancel="onCancel" :loading="loading" @ok="onOk" title="积分名称自定义">
    <a-checkbox :checked="selected" @change="selected = !selected">将积分名称自定义为</a-checkbox>
    <a-input v-model="value" :disabled="selected === false" style="width: 160px" placeholder="如：欢乐豆。最多5个字"/>
  </a-modal>
</template>

<script>
import PointService from '../../service/point.service'
import common from "../../common/common"
import constant from "../../common/constant"

export default {
  name: "PointRulePageUpdateName",
  props: {
    name: String,
    isOpen: Boolean,
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      selected: this.isOpen,
      value: this.name,
      isShow: this.visible
    }
  },
  watch: {
    visible() {
      this.selected = this.isOpen
      this.value = this.name
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onOk() {
      this.loading = true
      PointService.updateCommonRule({
        key: constant.pointCommonRule.pointName,
        value: {
          isOpen: this.selected,
          name: this.value
        }
      }).then((res) => {
        if (common.isSuccess(res)) {
          this.$emit('ok', {
            isOpen: this.selected,
            name: this.value
          })
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>