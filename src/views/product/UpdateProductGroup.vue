<template>
    <a-modal title="改分组" :confirm-loading="loading" :visible="isShow" @cancel="onCancel" @close="onCancel"
             @ok="onConfirm">
        <a-row>
            <a-col v-for="item in checkBoxList" :key="item.id" style="margin-bottom: 10px">
                <a-checkbox
                        :data-id="item.id"
                        :checked="item.check"
                        :indeterminate="item.isExists"
                        @change="onCheckChange(item)"
                >
                    {{ item.name }}
                </a-checkbox>
            </a-col>
        </a-row>
    </a-modal>
</template>

<script>
import ProductService from '../../service/product.service'
import util from '../../common/common'
import constant from '../../common/constant'

export default {
  name: 'UpdateProductGroup',
  props: {
    visible: Boolean,
    selectRowKeys: Array
  },
  data() {
    return {
      isShow: false,
      loading: false,
      groups: [],
      checkBoxList: []
    }
  },
  watch: {
    visible(nValue) {
      this.isShow = nValue
      if (this.isShow) {
        console.log(this)
        this.updateCheckStatus()
      }
    }
  },
  created() {
    ProductService.groupList({pageIndex: 1, pageSize: 100}).then((res) => {
      if (util.isSuccess(res)) {
        this.groups = res.data.result.list.map((x) => {
          return {id: x.id.toString(), name: x.name, check: false, isExists: false}
        })
        this.checkBoxList = [...this.groups]
      }
    })
  },
  methods: {

    onConfirm() {
      let result = this.update()
      if (result.length > 0) {
        this.loading = true
        ProductService.updateBatchGroup(result).then(res => {
          this.loading = false
          this.$emit('confirm')
        })
      } else {
        this.$emit('confirm')
      }
    },
    onCancel() {
      this.$emit('cancel')
    },

    updateCheckStatus() {
      for (let item of this.groups) {
        let count = 0
        for (let row of this.selectRowKeys) {
          if (row.groups.findIndex(x => x === parseInt(item.id)) > -1) {
            count += 1
          }
        }
        if (count === this.selectRowKeys.length) {
          item.check = true
        }
        if (count === 0) {
          item.check = false
          item.isExists = false
        }
        if (count > 0 && count < this.selectRowKeys.length) {
          item.check = false
          item.isExists = true
        }
      }
      this.checkBoxList = [...this.groups]
    },
    onCheckChange(value) {
      let index = this.checkBoxList.findIndex(x => x.id === value.id)
      this.checkBoxList[index].check = !value.check
      this.checkBoxList[index].isExists = false
    },
    update() {
      let request = []
      for (let ele of this.checkBoxList) {
        for (let row of this.selectRowKeys) {
          let isExists = row.groups.findIndex(x => x === parseInt(ele.id)) > -1
          //if (ele.isExists && isExists) continue
          //if (ele.check && isExists) continue
          if (ele.check === false && isExists) {
            request.push({
              productId: row.id,
              groupId: ele.id,
              status: constant.entityModifyStatus.delete
            })
            continue
          }
          if (ele.check && isExists === false) {
            request.push({
              productId: row.id,
              groupId: ele.id,
              status: constant.entityModifyStatus.add
            })
          }
        }
      }
      return request;
    }
  }
}
</script>

<style scoped>

</style>
