<template>
  <div>
    <a-form-model :model="model" :label-col="{md:{span:3},xl:{span:2}}" :wrapper-col="{span:10}">
      <a-form-item label="日签奖励">
        <a-input v-model="model.dailyPointAward" style="width: 80px"/>
        <span class="ml10">积分</span>
        <div class="mt5">
          <span class="text-muted font-size-13">用户每日签到可以获得的奖励</span>
        </div>
      </a-form-item>
      <a-form-item label="循环周期" required>
        <a-input addon-after="天" v-model="model.cycleDay" style="width: 90px"/>
        <span class="ml10 font-size-13">天</span>
        <span class="ml20 font-size-13 text-muted">单个周期内，每个连签奖励只可被领取一次</span>
      </a-form-item>
      <a-form-item label="连续奖励" required>
        <span class="text-muted font-size-13">超过固定周期天数的奖励将不向用户展示和发放</span>
        <div v-if="model.signContinuityAwardOptions.length>0" class="mt10 mb20">
          <a-table row-key="day" :columns="columns" :data-source="model.signContinuityAwardOptions"
                   :pagination="false"/>
        </div>
        <div class="mt5">
          <a-button @click="addAwardForm.visible = true" class="font-size-13">连新增连续奖励</a-button>
        </div>
      </a-form-item>
      <a-form-item label="规则说明">
        <a-textarea v-model="model.remark" :auto-size="{minRows:5}" style="width: 360px"/>
      </a-form-item>
      <a-form-item label="入口设置">
        <a-checkbox/>
        <span class="font-size-13 ml10">未签到用户每日第1次访问主页时弹出签到弹窗</span>
      </a-form-item>
    </a-form-model>
    <a-modal v-model="addAwardForm.visible" @close="addAwardForm.visible = false" @ok="onAddAward" title="连续签到奖励">
      <a-form-model>
        <a-row type="flex" align="middle" class="mb20">
          <a-col span="5">
            <span>签到天数</span>
          </a-col>
          <a-input v-model="addAwardForm.day" style="width: 120px"/>
          <span class="ml5">天</span>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col span="5">
            <span>积分</span>
          </a-col>
          <a-input v-model.number="addAwardForm.point" style="width: 120px"/>
          <span class="ml5">个</span>
        </a-row>
      </a-form-model>
    </a-modal>
    <p-footer>
      <template #content>
        <a-button :loading="loading" @click="onModelFormSubmit" type="primary">保存</a-button>
      </template>
    </p-footer>
  </div>
</template>

<script>

import SignService from '../../../service/sign.service'
import util from '../../../common/common'

export default {
  name: "SignInActivityRulePage",
  data() {
    return {
      addAwardForm: {
        index: -1,
        day: '',
        point: '',
        visible: false,
        error: {
          day: {
            isError: false,
            message: ''
          },
          point: {
            isError: false,
            message: ''
          }
        }
      },
      columns: [{
        title: '连续天数',
        dataIndex: 'day',
        customRender(value) {
          return `${value}天`
        }
      }, {
        title: '连续奖励',
        dataIndex: 'pointAward',
        customRender(value) {
          return `积分：${value}个`
        }
      }, {
        title: '操作',
        customRender: (value, row, index) => {
          return (
              <div>
                <a-button onClick={() => {
                  this.onOpenUpdate(value, index)
                }} type="link" class="text-action-btn">更改
                </a-button>
                <a-button onClick={() => {
                  this.onDelete(index)
                }} type="link" class="text-action-btn">删除
                </a-button>
              </div>
          )
        }
      }],
      continuityAward: [{
        signDay: 3,
        signAward: 10
      }],
      model: {
        dailyPointAward: '',
        cycleDay: '',
        isSignDialog: false,
        remark: '1.每日签到可以获得日签奖励，在单个周期内连续签到可以获得连签奖励，同1个周期内最多可领取1次；\n' +
            '2.每日最多可签到1次，断签则会重新计算连签天数；\n' +
            '3.活动以及奖励最终解释权归商家所有。',
        signContinuityAwardOptions: []
      },
      modelRules: {
        cycleDay: [{
          required: true, message: '请输入周期天数'
        }]
      },
      loading: false
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      SignService.get().then(res => {
        if (res.data.result) {
          this.model = res.data.result.value
        }
      })
    },
    onAddAward() {
      if (this.addAwardForm.day.length === 0) {
        this.$message.error('连签天数为2-365天')
        return
      }
      if (this.addAwardForm.day < 2) {
        this.$message.error('连签天数至少为2-356天')
        return
      }
      if (this.model.signContinuityAwardOptions.findIndex(ele => ele.day === parseInt(this.addAwardForm.day)) > -1 && this.addAwardForm.index === -1) {
        this.$message.error('你已设置过当前连签天数的奖励')
        return
      }
      let day = parseInt(this.addAwardForm.day)
      let point = parseInt(this.addAwardForm.point)
      if (this.addAwardForm.index === -1) {
        this.model.signContinuityAwardOptions.push({
          day: day,
          pointAward: point,
          awardType: 1
        })
      } else {
        this.model.signContinuityAwardOptions[this.addAwardForm.index].pointAward = point
        this.model.signContinuityAwardOptions[this.addAwardForm.index].day = day
      }
      this.model.signContinuityAwardOptions.sort((a, b) => {
        if (a.day > b.day) {
          return 1
        } else if (a.day < b.day) {
          return -1
        } else {
          return 0
        }
      })
      this.addAwardForm.visible = false
      this.addAwardForm.day = ''
      this.addAwardForm.point = ''
      this.addAwardForm.index = -1
    },
    onDelete(index) {
      this.model.signContinuityAwardOptions.splice(index, 1)
    },
    onOpenUpdate(value, index) {
      this.addAwardForm.visible = true
      this.addAwardForm.day = value.day
      this.addAwardForm.point = value.pointAward
      this.addAwardForm.index = index
    },
    onModelFormSubmit() {
      if (this.model.cycleDay.length === 0) {
        this.$message.error('请填写周期天数')
        return
      }
      if (this.model.signContinuityAwardOptions.length === 0) {
        this.$message.error('请设置连签奖励')
        return
      }
      this.loading = true
      SignService.update(this.model).then(res => {
        this.loading = false
        if (util.isSuccess(res)) {
          this.$message.success('保存成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
