<template>
    <div class="p-container">
        <div class="p-box p-box-bg-gary">
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="center">
                    <div style="width: 50%;">
                        <a-steps :current="step">
                            <a-step title="上传模板"></a-step>
                            <a-step title="批量发货"></a-step>
                            <a-step title="完成"></a-step>
                        </a-steps>
                    </div>
                </a-row>
            </div>
            <div class="p-box p-box-bg-white">
                <a-row type="flex" justify="center" style="padding: 100px">
                    <div style="text-align: center" v-if="step === 0">
                        <div v-if="file" class="font-bold" style="font-size: 16px">
                            <span>{{file.name}}</span>
                            <span class="ml5">({{progress}}%)</span>
                        </div>
                        <a-upload :showUploadList="false" :action="uploadUrl" name="file" :before-upload="beforeUpload"
                                  @change="onUploadChange" :accept="accept">
                            <div style="cursor: pointer" class="ant-upload-drag-icon">
                                <div v-if="file === null">
                                    <a-icon style="font-size: 80px;color: #2589FF;" type="cloud-upload" />
                                    <h4 style="color: #2589FF;" class="spacing">请选择文件上传</h4>
                                    <p class="ant-upload-text font-size-12" style="letter-spacing: 3px">
                                        最大支持1M的EXCEL文件
                                    </p>
                                </div>
                                <div v-else class="font-size-12 mt10">
                                    <span style="color: #2589FF;cursor: pointer">重新选择文件</span>
                                </div>
                            </div>
                        </a-upload>
                        <div v-if="file" class="mt20" style="text-align: center;margin-top: 20px">
                            <a-button class="mr10 font-size-12">取消</a-button>
                            <a-button class="font-size-12" type="primary" @click="onConfirm">确认发货</a-button>
                        </div>
                        <div class="font-size-12 pt5" style="text-align: center;margin-top: 10px">
                            没有模板？
                            <a :download="downloadUrl" :href="downloadUrl">下载批量发货模板</a>
                        </div>
                    </div>
                    <div v-if="step === 1" style="text-align: center">
                        <h4 style="color: #2589FF">系统正在处理发货申请，请等待....</h4>
                        <span class="text-muted">温馨提醒：如果数据量较大，可返回列表页进行查看</span>
                    </div>
                    <div v-if="step === 2" style="text-align: center">
                        <h3 style="color: #2589FF">发 货 订 单 处 理 完 成</h3>
                        <span>已处理订单数量：{{orderCount}}</span>
                        <div class="mt10">
                            <a-button @click="$router.push('/order/delivery/bulk')" class="mr10 font-size-12">完成导入
                            </a-button>
                            <a-button @click="onBack" class="font-size-12" type="primary">继续导入
                            </a-button>
                        </div>
                    </div>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script>
import constant from '../../common/constant';
import bulkImportService from '../../service/bulkImportService';

export default {
  name: 'OrderDeliveryUploadPage',
  data() {
    return {
      file: null,
      step: 0,
      uploadUrl: process.env.VUE_APP_UPLOAD_IMPORT_URL,
      progress: 0.00,
      accept: '.xls,.xlsx',
      timer: null,
      url: '',
      taskId: 0,
      orderCount: ''
    }
  },
  computed: {
    downloadUrl() {
      return this.uploadUrl.replace('common/file/import', 'template/批量发货模板.xlsx')
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.size > 1024 * 1024) {
        this.$message.warning('文件不要超过1MB大小')
        return false
      }
      this.file = file
    },
    onConfirm() {
      if (this.progress < 100) return
      this.step = 1
      let req = {
        file: this.url,
        type: 1
      }
      bulkImportService.add(req).then(res => {
        if (res.data.code === constant.serviceCode.success) {
          this.taskId = res.data.result
          this.polling()
        }
      })
    },
    polling() {
      this.timer = window.setInterval(() => {
        bulkImportService.getTaskHandleResult({id: this.taskId}).then(res => {
          if (res.data.result !== null) {
            if (res.data.result.status === 2) {
              this.step = 2
              this.orderCount = res.data.result.secCount
              window.clearInterval(this.timer)
            }
          }
        })
      }, 3000)
    },
    onUploadChange(e) {
      if (e.hasOwnProperty('event')) {
        this.progress = e.event.percent.toFixed(2)
      }
      if (e.file.status === 'done') {
        if (e.file.response.code === constant.serviceCode.success) {
          console.log()
          this.url = e.file.response.result.url
        }
      }
    },
    onBack() {
      this.step = 0
      this.file = null
      this.progress = 0.00
    }
  },
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
    /deep/ .ant-steps-item-title {
        font-size: 14px;
    }
</style>
