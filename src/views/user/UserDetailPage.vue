<template>
  <page :loading="loading">
    <div class="p-box p-box-bg-gary">
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="基本信息" type="left"/>
        <a-row style="padding-left: 15px" class="mt20">
          <a-row type="flex" align="middle">
            <img class="info-basic-img" :src="getAvatar"/>
            <a-row style="margin-left: 30px">
              <a-row type="flex" align="middle">
                <div class="mr15" style="font-weight: bold;font-size: 16px">
                  匿名用户
                </div>
                <a-tag :color="model.levelColor">{{ model.levelName }}</a-tag>
              </a-row>
              <a-row class="mt5" type="flex">
                <div>渠道：</div>
                <div>未知</div>
                <a class="ml10">所有登录渠道</a>
              </a-row>
            </a-row>
          </a-row>
          <a-row class="mt20" style="margin-left: 90px">
            <a-row class="info-basic-count" type="flex">
              <a-col span="8">
                <span>姓名：</span>
                <span>{{ model.nickname }}</span>
              </a-col>
              <a-col span="8">
                <span>手机号：</span>
                <span>{{ model.phone }}</span>
              </a-col>
              <a-col span="8">
                <span>成长值：</span>
                <span>0</span>
              </a-col>
            </a-row>
            <a-row class="mt10 info-basic-count" type="flex">
              <a-col span="8">
                <span>成为客户：</span>
                <span>{{ model.createDate }}</span>
              </a-col>
              <a-col span="8">
                <span>来源方式：</span>
                <span>登录创建客户</span>
              </a-col>
              <a-col span="8">
                <span>来源渠道：</span>
                <span>其他</span>
              </a-col>
            </a-row>
            <a-row class="mt10 info-basic-count" type="flex">
              <a-col span="8">
                <span>成为会员：</span>
                <span>{{ getCreateVipDate }}</span>
              </a-col>
              <a-col span="8">
                <span>推荐人：</span>
                <span>{{ model.parentName }}</span>
              </a-col>
            </a-row>
            <a-row class="mt10 info-basic-count" type="flex">
              <a-col span="8">
                <span>最近浏览：</span>
                <span>未知</span>
              </a-col>
              <a-col span="8">
                <span>最近收货地址：</span>
                <span>未知</span>
              </a-col>
            </a-row>
            <a-row class="mt10 info-basic-count" type="flex">
              <a-col span="8">
                <span>备注：</span>
                <span>无</span>
              </a-col>
            </a-row>
          </a-row>
        </a-row>
      </div>
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="客户资料" type="left"/>
        <a-row class="mt20 ml15" type="flex">
          <a-col class="info-basic-count" span="4">
            <span>性别：</span>
            <span>保密</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>生日：</span>
            <span>暂无</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>地区：</span>
            <span>暂无</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>微信号：</span>
            <span>{{ getWx }}</span>
          </a-col>
        </a-row>
        <a-row class="mt20 ml15" type="flex">
          <a-col class="info-basic-count" span="4">
            <span>支付宝姓名：</span>
            <span>{{ getZfbName }}</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>支付宝账号：</span>
            <span>{{ getZfbNumber }}</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>真实姓名：</span>
            <span>{{ getIdentityName }}</span>
          </a-col>
          <a-col class="info-basic-count" span="4">
            <span>身份证号：</span>
            <span>{{ getIdentityNumber }}</span>
          </a-col>
        </a-row>
      </div>
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="资产统计" type="left"/>
        <a-row type="flex" class="ml15 mt20">
          <a-col span="4">
            <a-statistic title="可用余额" :precision="2" :value="model.availableAmount"/>
          </a-col>
          <a-col span="4">
            <div class="ant-statistic">
              <div class="ant-statistic-title">
                <span>可用积分</span>
                <a-popover :visible="pointChangeForm.visible" trigger="click">
                  <template style="width: 300px" #content>
                    <a-form-model ref="pointForm" :label-col="{span:5}" :wrapper-col="{span:15}"
                                  :model="pointChangeForm"
                                  layout="horizontal"
                                  :rules="{value:[{required:true,message:'请填写积分数量'}],msg:[{required:true,message:'请填写备注原因'}]}">
                      <a-form-model-item label="数量" required prop="value">
                        <a-input placeholder="请输入要加/减的积分数量" v-model="pointChangeForm.value"/>
                      </a-form-model-item>
                      <a-form-model-item label="原因" required prop="msg">
                        <a-textarea placeholder="备注原因" v-model="pointChangeForm.msg"/>
                      </a-form-model-item>
                    </a-form-model>
                    <a-row type="flex" justify="end">
                      <a-button @click="pointChangeForm.visible = false" class="p-input-right-5">取消</a-button>
                      <a-button :loading="pointChangeForm.loading" @click="onPointChangeSubmit" type="primary">确认
                      </a-button>
                    </a-row>
                  </template>
                  <span @click="pointChangeForm.visible = true" class="ml10"
                        style="color: #155bd4;cursor: pointer">给积分</span>
                </a-popover>
              </div>
              <div class="ant-statistic-content">
                <router-link tag="span" :to="{
                   path:'/user/point/tx',query:{uid:$route.query.uid}
                 }">
                     <span class="ant-statistic-content-value"><span
                         class="ant-statistic-content-value-int">
                       <a style="cursor: pointer;color: #155bd4">{{ model.pointTotal }}</a>
                     </span></span>
                </router-link>
              </div>
            </div>
          </a-col>
          <a-col span="4">
            <a-statistic title="可用优惠券" :precision="2" :value="0"/>
          </a-col>
        </a-row>
      </div>
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="收益统计" type="left"/>
        <a-row type="flex" class="ml15 mt20">
          <a-col span="4">
            <a-statistic title="累计提现" :precision="2" :value="model.withdrawTotal"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="累计充值" :precision="2" :value="model.rechargeTotal"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="拼团收益" :precision="2" :value="model.groupBuyIncomeTotal"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="推荐收益" :precision="2" :value="model.inviteIncomeTotal"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="分销收益" :precision="2" :value="model.saleIncomeTotal"/>
          </a-col>
        </a-row>
      </div>
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="团队统计" type="left"/>
        <a-row type="flex" class="ml15 mt20">
          <a-col span="4">
            <a-statistic title="一级团队人数" :precision="0" :value="model.invitePeopleCount1"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="一级团队业绩" :precision="2" :value="model.invitePeopleCountSale1"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="二级团队人数" :precision="0" :value="model.invitePeopleCount2"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="二级团队业绩" :precision="2" :value="model.invitePeopleCountSale2"/>
          </a-col>
          <a-col span="4">
            <a-statistic title="团队总人数" :value="model.invitePeopleTotal"/>
          </a-col>
        </a-row>
      </div>
      <div class="p-box p-box-bg-white info-basic">
        <p-title title="交易统计" type="left"/>
        <a-row type="flex" class="ml15 mt20">
          <a-col span="6">
            <a-statistic title="累计消费金额（元）" :precision="2" :value="model.orderPriceTotal"/>
          </a-col>
          <a-col span="6">
            <a-statistic title="累计消费订单数" :precision="0" :value="model.orderTotal"/>
          </a-col>
          <a-col span="6">
            <a-statistic title="累计退款金额（元）" :precision="2" :value="0"/>
          </a-col>
          <a-col span="6">
            <a-statistic title="累计退款订单数" :precision="0" :value="0"/>
          </a-col>
        </a-row>
      </div>
    </div>
  </page>
</template>

<script>
import Page from '../../components/Page'
import Title from '../../components/Title'
import UserService from '../../service/user.service'
import PointService from '../../service/point.service'
import util from '../../common/common'

export default {
  name: 'UserDetailPage',
  components: {
    Page,
    'p-title': Title
  },
  data() {
    return {
      loading: false,
      pointChangeForm: {
        value: '',
        msg: '',
        visible: false,
        loading: false
      },
      model: {
        avatar: '',
        levelName: '',
        levelColor: '',
        isCertification: false,
        nickname: '',
        createDate: '',
        createVipDate: '',
        phone: '',
        parentName: '',
        sex: '',
        wxNumber: '',
        zfbName: '',
        zfbNumber: '',
        identityName: '',
        identityCode: '',
        availableAmount: 0,
        groupBuyIncomeTotal: 0,
        inviteIncomeTotal: 0,
        saleIncomeTotal: 0,
        withdrawTotal: 0,
        pointTotal: 0,
        rechargeTotal: 0,
        invitePeopleCount1: 0,
        invitePeopleCount2: 0,
        invitePeopleTotal: 0,
        invitePeopleCountSale1: 0,
        invitePeopleCountSale2: 0,
        orderTotal: 0,
        orderPriceTotal: 0,
        orderRefundTotal: 0,
        orderRefundPriceTotal: 0,
      }
    }
  },
  computed: {
    getWx() {
      return util.TextExtend.String.isEmptyOrNull(this.model.wxNumber) ? '-' : this.model.wxNumber
    },
    getZfbName() {
      return util.TextExtend.String.isEmptyOrNull(this.model.zfbName) ? '-' : this.model.zfbName
    },
    getZfbNumber() {
      return util.TextExtend.String.isEmptyOrNull(this.model.zfbNumber) ? '-' : this.model.zfbNumber
    },
    getAvatar() {
      return util.TextExtend.String.isEmptyOrNull(this.model.avatar) ? require('../../assets/img/default_avatar.png') : this.model.avatar
    },
    getIdentityName() {
      return this.model.isCertification ? this.model.identityName : '-'
    },
    getIdentityNumber() {
      return this.model.isCertification ? this.model.identityCode : '-'
    },
    getCreateVipDate() {
      return this.model.createVipDate === null ? '-' : this.model.createVipDate
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      UserService.get({
        uid: this.$route.query.uid
      }).then(res => {
        this.loading = false
        this.model = res.data.result
      })
    },
    onPointChangeSubmit() {
      this.$refs.pointForm.validate(valid => {
        if (valid === false) return
        this.pointChangeForm.loading = true
        PointService.updateUserPoint({
          value: this.pointChangeForm.value,
          msg: this.pointChangeForm.msg,
          uid: this.$route.query.uid
        }).then(res => {
          this.pointChangeForm.loading = false
          if (util.isSuccess(res) === false) {
            this.$message.error(res.data.result.msg)
            return
          }
          this.$refs.pointForm.resetFields()
          this.pointChangeForm.visible = false;
          this.load()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.info-basic {
  padding-top: 15px;
  padding-bottom: 15px;

  .info-basic-img {
    width: 60px;
    height: 60px;
    border-radius: 60px;
  }

  .info-basic-count {
    font-size: 14px;
  }
}
</style>
