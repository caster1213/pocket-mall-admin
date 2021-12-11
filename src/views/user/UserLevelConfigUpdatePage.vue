<template>
    <div class="p-container">
        <p-title title="基础信息" type="line" />
        <div style="margin-top: 25px;position: relative">
            <div :style="{'background':`linear-gradient(30deg, ${colorSelectValue} 0%, ${colorSelectValue} 100%)`}"
                 class="vip-card-style">
                <div :style="{'background-image':coverImage}"
                     class="container">
                    <a-row type="flex">
                        <span style="font-weight: bold;font-size: 18px">VIP 4</span>
                    </a-row>
                    <a-row type="flex" justify="start"
                           style="align-items: baseline;margin-top: 30px;margin-bottom: 25px">
                        <span class="mr5" style="font-size: 26px">7</span>
                        <span style="font-size: 14px">成长值</span>
                    </a-row>
                    <a-row class="mb15" type="flex">
                        <div style="border: 1px solid white;width: 100%;"></div>
                    </a-row>
                    <a-row type="flex">
                        <span class="font-size-12">在获得 0 成长值成为 LV.4</span>
                    </a-row>
                </div>
                <a-row type="flex" justify="center">
                    <span class="font-size-12 gray-7 mt5">仅为预览，实际以用户查看时为准</span>
                </a-row>
            </div>
            <a-form-model ref="entityForm" :model="entity" :rules="entityRules" :label-col="{span:3}"
                          :wrapper-col="{span:15}">
                <a-form-model-item label="等级名称" required prop="name">
                    <a-input v-model="entity.name" style="width: 170px" />
                </a-form-model-item>
                <a-form-model-item label="等级背景" required>
                    <a-row type="flex" justify="start">
                        <a-radio-group class="radio-list" v-model="entity.coverType">
                            <a-radio value="color">背景色</a-radio>
                            <a-radio value="img">背景图</a-radio>
                        </a-radio-group>
                        <div class="cover-color-select">
                            <div @click="colorSelectVisible=true" class="cover-color-select-active"
                                 :style="{backgroundColor: colorSelectValue}"></div>
                            <div v-show="colorSelectVisible" class="cover-color-select-item-container">
                                <div v-for="color in colors" :key="color" @click="onColorSelected(color)"
                                     :style="{backgroundColor:color}"
                                     class="cover-color-select-item"></div>
                            </div>
                        </div>
                    </a-row>
                    <p-upload-cell style="margin-top: 10px" :upload-max="1" :cells="imageSelectValue" />
                    <div class="gray-6 font-size-12">
                        尺寸：1000*600像素，小于1M，支持jpg、png、jpeg格式
                    </div>
                </a-form-model-item>
                <a-form-model-item label="升级条件" required prop="experience">
                    <div>
                        <span class="mr10">成长值</span>
                        <a-input v-model="entity.experience" style="width: 170px" />
                    </div>
                    <div class="font-size-12 gray-6 mt10">修改等级所需成长值后，部分客户会因无法达到该成长值要求而发生会员等级的变化</div>
                    <div>
                        <a-checkbox-group :value="[entity.isCustomLevelUpRule]">
                            <a-checkbox :value="true" @change="onCustomRuleChange">自定义升级规则</a-checkbox>
                        </a-checkbox-group>
                        <div class="font-size-12 gray-6">勾选后自定义规则覆盖系统的默认升级规则</div>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>
        <p-footer>
            <template #content>
                <a-button @click="$router.back()" class="mr20">取消</a-button>
                <a-button @click="onSubmit" :loading="loading" type="primary">提交</a-button>
            </template>
        </p-footer>
    </div>
</template>

<script>
import Title from '../../components/Title'
import UploadCell from '../../components/material/UploadCell'
import pattern from '../../common/pattern'
import UserVipLevelService from '../../service/user.level.service'
import constant from '../../common/constant';

export default {
  name: 'UserLevelConfigUpdatePage',
  components: {'p-title': Title, 'p-upload-cell': UploadCell},
  data() {
    return {
      colors: ['#e7b05c', '#868686', '#e96c50', '#75b06d', '#48a97a', '#6ab7de', '#6385bd', '#9b6fc8', '#eec154', '#eb962d', '#fb9f2e', '#aac564', '#de5850', '#cf3e36'],
      colorSelectVisible: false,
      colorSelectValue: '#e7b05c',
      imageSelectVisible: false,
      imageSelectValue: [],
      imageStyle: {},
      loading: false,
      entity: {
        id: '',
        name: '',
        vipCover: '',
        coverType: 'color',
        experience: '',
        isCustomLevelUpRule: false
      },
      entityRules: {
        name: [{
          required: true,
          message: '必须填写会员等级'
        }],
        experience: [{
          required: true,
          message: '必须填写成长值'
        }, {
          pattern: pattern.decimal0,
          message: '请填写正确的数值'
        }]
      }
    }
  },
  computed: {
    coverImage() {
      if (this.entity.coverType === 'img' && this.imageSelectValue.length > 0) {
        return `url(${this.imageSelectValue[0]})`
      } else {
        let a = require('../../assets/img/vip-bg.png')
        return `url(${a})`
      }
    }
  },
  created() {
    window.addEventListener('click', this.closeColorSelect)
    if (this.$route.query.hasOwnProperty('id')) {
      let id = this.$route.query.id
      UserVipLevelService.get({id: id}).then(res => {
        this.entity = res.data.result
        if (this.entity.coverType === 'img') {
          this.imageSelectValue.push(this.entity.vipCover)
        } else {
          this.colorSelectValue = this.entity.vipCover
        }
      })
    }
  },
  methods: {
    closeColorSelect(e) {
      let ele = ['cover-color-select', 'cover-color-select-active', 'cover-color-select-item-container', 'cover-color-select-item']
      if (ele.indexOf(e.target.className) < 0) {
        if (this.colorSelectVisible) {
          this.colorSelectVisible = false
        }
      }
    },
    onColorSelected(color) {
      if (this.entity.coverType === 'color') {
        this.colorSelectValue = color
      }
    },
    onCustomRuleChange(e) {
      this.entity.isCustomLevelUpRule = e.target.checked
    },
    onSubmit() {
      if (this.entity.coverType === 'color') {
        this.entity.vipCover = this.colorSelectValue
      } else {
        this.entity.vipCover = this.imageSelectValue[0]
      }
      this.$refs.entityForm.validate(valid => {
        if (valid === false) return
        this.loading = true
        if (this.entity.id.toString().length > 0) {
          UserVipLevelService.update(this.entity).then(res => {
            this.loading = false
            if (res.data.code === constant.serviceCode.success) {
              this.$message.success('等级更新成功', 1.5, () => {
                this.$router.push('/user/level')
              })
            }
          }).then(err => {
            this.loading = false
          })
        } else {
          console.log(12)
          this.entity.id = 0
          UserVipLevelService.add(this.entity).then(res => {
            this.loading = false
            if (res.data.code === constant.serviceCode.success) {
              this.$message.success('等级更新成功', 1.5, () => {
                this.$router.push('/user/level')
              })
            }
          }).then(err => {
            this.loading = false
          })
        }
      })
    }
  },
  destroyed() {
    window.removeEventListener('click', this.closeColorSelect)
  }
}
</script>

<style lang="less" scoped>
    @import "../../assets/css/color.css";

    .cover-color-select {
        border: 1px solid #dcdee0;
        padding: 5px;
        height: 32px;
        width: 60px;
        box-sizing: border-box;
        position: relative;
    }

    .cover-color-select-active {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .cover-color-select-item-container {
        z-index: 100;
        width: 190px;
        position: absolute;
        left: 0;
        top: 33px;
        background-color: white;
        box-shadow: 0 2px 8px 0 rgb(200 201 204);
        padding-top: 10px;
        display: flex;
        flex-wrap: wrap;
    }

    .cover-color-select-item {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        margin-left: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    .vip-card-style {
        position: absolute;
        top: 0;
        right: 0;
        width: 343px;
        height: 180px;
        border-radius: 12px;
        color: white;

        .container {
            //background-image: url("../../assets/img/vip-bg.png");
            background-repeat: no-repeat;
            height: 100%;
            width: 100%;
            padding: 10px;
        }
    }
</style>
