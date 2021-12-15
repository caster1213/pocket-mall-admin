<template>
  <p-footer>
    <template #content>
      <a-row class="footer-page-container" type="flex" justify="end" align="middle">
        <div style="margin: 10px;color:#9797a1;" class="font-size-12">
          <span>总共{{ pageTotal }}条，</span>
          <span>当前为第{{ pageIndex }}页</span>
        </div>
        <div>
          <a-pagination v-if="pageTotal>0" show-quick-jumper show-size-changer
                        v-model="index"
                        :default-current="1"
                        :page-size="size"
                        :total="pageTotal"
                        @change="onChangeNextPage"
                        @showSizeChange="onChangePageSize"
                        :page-size-options="option"></a-pagination>
        </div>
      </a-row>
    </template>
  </p-footer>
</template>

<script>
export default {
  name: 'FooterBoxPage',
  props: {
    pageIndex: Number,
    pageSize: Number,
    pageTotal: Number,
    pageSizeOption: Array
  },
  watch: {
    pageIndex() {
      this.index = this.pageIndex
    }
  },
  data() {
    return {
      total: this.pageTotal,
      index: this.pageIndex,
      size: 25,
      option: ['25', '50', '100']
    }
  },
  methods: {
    onChangeNextPage(pageIndex, pageSize) {
      this.$emit('nextPage', pageIndex, pageSize)
    },
    onChangePageSize(pageIndex, pageSize) {
      this.size = pageSize
      this.$emit('nextPageSize', pageIndex, pageSize)
    }
  }
}
</script>

<style scoped>
.footer-page-container {
  width: 100%;
  height: 100%;
  margin-right: 20px;
}
</style>
