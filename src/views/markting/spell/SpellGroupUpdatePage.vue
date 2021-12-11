<template>
    <div>
        <div style="position: relative">
            <p-title title="基本信息" />
            <div class="p-box">
                <a-form :form="baseForm" :labelCol="{span:3}" :wrapperCol="{span:12}">
                    <a-form-item label="活动名称" required>
                        <a-input v-decorator="['name',{rules:[{required:true,message:'必须填写入活动名称'}]}]"
                                 style="width: 300px;height: 30px"></a-input>
                    </a-form-item>
                    <a-form-item label="活动时间" required>
                        <a-range-picker v-decorator="['activityDate',{rules:[{required:true,message:'必须填写入活动名称'}]}]"
                                        style="width: 300px;height: 30px" :show-time="true"
                                        :disabledDate="disableDate"
                                        format="YYYY-MM-DD HH:mm"></a-range-picker>
                    </a-form-item>
                </a-form>
            </div>
            <p-title title="活动规则" />
            <div class="p-box">
                <a-form :form="baseForm" :labelCol="{span:3}" :wrapperCol="{span:12}">
                    <a-form-item label="奖励金额" required>
                        <a-input v-decorator="['notTradeAward',{rules:[
                        {required:true,message:'必须填写奖励金额'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]" style="width: 300px;height: 30px"/>
                    </a-form-item>
                  <a-form-item label="奖励积分" required>
                    <a-input v-decorator="['pointAward',{rules:[
                        {required:true,message:'必须填写奖励积分'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]" style="width: 300px;height: 30px"/>
                  </a-form-item>
                  <a-form-item label="额外奖励积分" required>
                    <a-input v-decorator="['hitPointAward',{rules:[
                        {required:true,message:'必须填写奖励积分'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]" style="width: 300px;height: 30px"/>
                  </a-form-item>
                  <!--  <a-form-item label="一代奖励" required>
                        <a-input v-decorator="['directBonus',{rules:[
                        {required:true,message:'必须填写一代奖励'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]" style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="二代奖励" required>
                        <a-input v-decorator="['indirectBonus',{rules:[
                        {required:true,message:'必须填写二代奖励'},
                        {pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,message: '请填写正确的数字,小数点最多保留2位'}
                        ]}]" style="width: 300px;height: 30px"/>
                    </a-form-item>-->
                    <a-form-item label="拼团价格" required>
                        <a-input-number :min="1" v-decorator="['price',{rules:[
                        {required:true,message:'必须填写拼团价格'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"
                                        style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="成团间隔" required>
                        <a-input-number :min="1" v-decorator="['interval',{rules:[
                        {required:true,message:'必须填写成团间隔'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"
                                        style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="拼团人数" required>
                        <a-input-number :min="2" v-decorator="['groupSize',{rules:[
                        {required:true,message:'必须填写成团人数'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"
                                        style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="中奖人数" required>
                        <a-input-number :min="1" v-decorator="['hitCount',{rules:[
                        {required:true,message:'必须填写中奖人数'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"
                                        style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="每日参与最大次数" required>
                        <a-input-number :min="1" v-decorator="['dailyMaxWheelCount',{rules:[
                        {required:true,message:'必须填写每日参与最大次数'},
                        {pattern: /^(0|[1-9][0-9]*)$/,message: '请填写正确的数字'}]}]"
                                        style="width: 300px;height: 30px"/>
                    </a-form-item>
                    <a-form-item label="成团时间" required>
                        <a-time-picker format="HH:mm" v-decorator="['spellTimeStart']"
                                       class="font-size-12 p-input-right"/>
                        <span>:</span>
                        <a-time-picker format="HH:mm" v-decorator="['spellTimeEnd']"
                                       class="font-size-12 p-input-left"/>
                    </a-form-item>
                </a-form>
            </div>
            <p-title title="活动宣传" />
            <div class="p-box">
                <a-form :form="baseForm" :labelCol="{span:3}" :wrapperCol="{span:12}">
                    <a-form-item label="预热时间">
                        <a-checkbox @change="onChangeReady" v-decorator="['isReady',{valuePropName:'checked'}]"
                                    class="font-size-12">开启活动预热
                        </a-checkbox>
                        <span style="margin-left: 5px" class="font-size-12 text-muted">开启则活动开始前会在商详页展示活动信息</span>
                        <div>
                            <a-input :disabled="isReady ===false"
                                     v-decorator="['readyHour']"
                                     style="width: 130px;height: 30px"
                                     addon-after="小时"></a-input>
                            <span style="margin-left: 5px" class="font-size-12 text-muted">最多240小时</span>
                        </div>
                    </a-form-item>
                    <a-form-item label="活动说明">
                        <a-textarea v-decorator="['detail']"
                                    style="width: 300px;height: 120px;resize: none"></a-textarea>
                    </a-form-item>
                </a-form>
            </div>
        </div>

        <div class="p-footer">
            <a-row style="height: 100%" type="flex" justify="center" align="middle">
                <div>
                    <a-button @click="submit" class="font-size-12 p-input-right" type="primary">保存</a-button>
                    <a-button @click="toAppendProductPage" class="font-size-12 p-input-right" type="primary">保存并添加活动商品
                    </a-button>
                    <a-button @click="()=>$router.back()" class="font-size-12 p-input-right">返回</a-button>
                </div>
            </a-row>
        </div>
    </div>
</template>

<script>
import SpellActivityService from '../../../service/spell.activity.service'
import moment from 'moment'
import SpellService from '../../../service/spellGroup.service'
import constant from '../../../common/constant'
import Title from '../../../components/Title'

export default {
  name: 'SpellGroupUpdatePage',
  components: {
    'p-title': Title
  },
  data() {
    return {
      baseForm: this.$form.createForm(this),
      isReady: false,
      model: {
        startDate: '',
        endDate: ''
      }
    }
  },
  created() {
    SpellActivityService.get({id: this.$route.query.id}).then(res => {
      let activity = res.data.result
      this.model = activity
      this.isReady = activity.readyHour > 0
      this.baseForm.getFieldDecorator('id', {initialValue: activity.id, preserve: true})
      this.baseForm.getFieldDecorator('name', {initialValue: activity.name})
      this.baseForm.getFieldDecorator('readyHour', {initialValue: activity.readyHour})
      this.baseForm.getFieldDecorator('isReady', {initialValue: activity.readyHour > 0})
      this.baseForm.getFieldDecorator('activityDate', {initialValue: [moment(activity.startDate), moment(activity.endDate)]})
      this.baseForm.getFieldDecorator('notTradeAward', {initialValue: activity.spellRule.notTradeAward})
      this.baseForm.getFieldDecorator('dailyMaxWheelCount', {initialValue: activity.spellRule.dailyMaxWheelCount})
      //this.baseForm.getFieldDecorator('indirectBonus', {initialValue: activity.spellRule.indirectBonus})
      //this.baseForm.getFieldDecorator('shopPointRatio', {initialValue: activity.spellRule.shopPointRatio})
      this.baseForm.getFieldDecorator('price', {initialValue: activity.spellRule.price})
      this.baseForm.getFieldDecorator('groupSize', {initialValue: activity.spellRule.groupSize})
      this.baseForm.getFieldDecorator('pointAward', {initialValue: activity.spellRule.pointAward})
      this.baseForm.getFieldDecorator('hitPointAward', {initialValue: activity.spellRule.hitPointAward})
      this.baseForm.getFieldDecorator('incomeMultiple', {initialValue: activity.spellRule.incomeMultiple})
      this.baseForm.getFieldDecorator('hitCount', {initialValue: activity.spellRule.hitCount.toString()})
      this.baseForm.getFieldDecorator('interval', {initialValue: activity.spellRule.interval})
      this.baseForm.getFieldDecorator('detail', {initialValue: activity.detail})
      this.baseForm.getFieldDecorator('spellTimeStart', {initialValue: moment([2020, 1, 1, activity.spellRule.startHour, activity.spellRule.starMinute, 0])})
      this.baseForm.getFieldDecorator('spellTimeEnd', {initialValue: moment([2020, 1, 1, activity.spellRule.endHour, activity.spellRule.endMinute, 0])})
      this.baseForm.setFieldsValue({name: activity.name})
      console.log(this.isEdit)
    })
  },
  computed: {
    isEdit() {
      let end = moment(this.model.endDate)
      let current = moment(new Date())
      return current.isBefore(end)
    }
  },
  methods: {
    submit() {
      this.baseForm.validateFields((err, value) => {
        this.add(err, value, () => {
          this.$router.push('/marketing/spell/page').then()
        })
      })
    },
    toAppendProductPage() {
      this.baseForm.validateFields((err, value) => {
        this.add(err, value, () => {
          this.$router.push('/marketing/spell/product').then()
        })
      })
    },
    add(err, value, callback) {
      if (err) return
      value.startDate = value.activityDate[0].format('YYYY-MM-DD HH:mm')
      value.endDate = value.activityDate[1].format('YYYY-MM-DD HH:mm')
      if (parseInt(value.hitCount) >= parseInt(value.groupSize)) {
        this.$message.warning('中奖人数必须小于成团人数')
        return
      }
      if (value.spellTimeStart === null) {
        this.$message.warning('请填写拼团起始时间')
        return
      }
      if (value.spellTimeEnd === null) {
        this.$message.warning('请填写拼团截止时间')
        return
      }
      value.startHour = value.spellTimeStart.hour()
      value.starMinute = value.spellTimeStart.minute()
      value.endHour = value.spellTimeEnd.hour()
      value.endMinute = value.spellTimeEnd.minute()
      SpellService.update(value).then(res => {
        if (res.data.code === constant.serviceCode.success) {
          this.$message.success('更新成功').then(() => {
            callback()
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    disableDate(current) {
      let now = moment(new Date())
      return now.isAfter(current, 'day')
    },
    onChangeReady(e) {
      this.isReady = e.target.checked
      if (this.isReady) {
        this.baseForm.setFieldsValue({
          readyHour: 1
        })
      } else {
        this.baseForm.setFieldsValue({
          readyHour: 0
        })
      }
    }
  }
}
</script>

<style scoped>
    @import "../../../assets/css/page-box.css";
</style>
