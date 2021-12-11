<template>
  <a-popover :visible="visible" placement="bottomLeft" trigger="click">
    <template slot="content">
      <div class="user-level-select-picker">
        <div class="head">
          <div>
            <span class="mr5">选择客户身份</span>
            <a-button class="text-action-btn" type="link">刷新</a-button>
          </div>
          <a-button class="text-action-btn" type="link">等级设置</a-button>
        </div>
        <div class="search">
          <a-input-search v-model="searchValue" placeholder="请输入搜索内容"/>
        </div>
        <div class="select">
          <div class="select-left">
            <div @click="onFreeClick" :class="{'select-item-active':free.isActive}"
                 class="select-item select-item-filter">
              <a-checkbox :checked="free.selected" @change="onFreeChange" :indeterminate="freeChecked">免费会员</a-checkbox>
              <a-icon type="right" style="font-size: 8px"/>
            </div>
            <div @click="onChargeClick" :class="{'select-item-active':charge.isActive}"
                 class="select-item select-item-filter">
              <a-checkbox>付费会员</a-checkbox>
              <a-icon type="right" style="font-size: 8px"/>
            </div>
          </div>
          <div class="select-right">
            <div v-for="ele in searchResult" :key="ele.level" class="select-item">
              <a-checkbox @change="onFreeItemChange($event,ele)" :checked="ele.selected">{{ ele.name }}</a-checkbox>
            </div>
          </div>
        </div>
        <div class="bottom-confirm">
          <a-button @click="visible=false" class="mr5">取消</a-button>
          <a-button @click="onConfirm" type="primary">确认</a-button>
        </div>
      </div>
    </template>
    <a-button @click="visible=true" class="text-action-btn" type="link">选择客户身份</a-button>
  </a-popover>
</template>

<script>
import UserLevelService from '../service/user.level.service'

export default {
  name: "UserLevelSelectPicker",
  props: {},
  data() {
    return {
      visible: false,
      free: {
        selected: false,
        isActive: true,
        level: [],
        searchResult: []
      },
      charge: {
        selected: false,
        isActive: false,
        level: [],
        searchResult: []
      },
      searchValue: '',

    }
  },
  computed: {
    freeChecked() {
      let selected = this.free.level.filter(x => x.selected).length
      if (selected === this.free.level.length) {
        return false
      }
      return selected > 0
    },
    searchResult() {
      let key = ''
      if (this.free.isActive) {
        key = 'free'
      } else {
        key = 'charge'
      }
      if (this.searchValue.length === 0) {
        return this[key].level
      }
      return this[key].level.filter(x => x.name.indexOf(this.searchValue) > -1)
    }
  },
  created() {
    UserLevelService.list().then(res => {
      this.free.level = res.data.result.map(ele => {
        return {
          level: ele.level,
          name: ele.name,
          selected: false
        }
      })
    })
  },
  methods: {
    onConfirm() {
      this.visible = false
      this.$emit('confirm')
    },
    onFreeClick() {
      this.charge.isActive = false
      this.free.isActive = true
    },
    onChargeClick() {
      this.charge.isActive = true
      this.free.isActive = false
    },
    onFreeItemChange(e, ele) {
      ele.selected = e.target.checked
      if (this.free.level.length === this.free.level.filter(x => x.selected).length) {
        this.free.selected = true
      }
    },
    onFreeChange(e) {
      this.free.selected = e.target.checked
      this.free.level.forEach(x => x.selected = this.free.selected)
    }
  }
}
</script>

<style lang="less" scoped>
.user-level-select-picker {
  background-color: white;

  .head {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
  }

  .search {
    width: 360px;

    /deep/ .ant-input {
      border-radius: 0;
    }
  }

  .select {
    display: flex;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    height: 200px;

    .select-left {
      flex: 1;
      border-right: 1px solid #e5e5e5;
    }

    .select-right {
      flex: 1;
      overflow-y: auto;
    }


    .select-item {
      height: 35px;
      display: flex;
      align-items: center;
      padding-right: 10px;
      padding-left: 10px;
      align-items: center;
      cursor: pointer;
    }

    .select-item-filter {
      justify-content: space-between;
    }

    .select-item-active {
      background-color: #f2f7fe;
    }


  }

  .bottom-confirm {
    display: flex;
    justify-content: right;
    margin-top: 10px;
  }
}
</style>
