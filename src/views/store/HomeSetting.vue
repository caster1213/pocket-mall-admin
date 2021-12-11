<template>
  <div class="page-setting-container">
    <p-page-select-pricker :visible="pageSelectPickerVisible" @close="pageSelectPickerVisible = false"
                           @confirm="onConfirmLink"/>
    <p-goods-select-pricker title="选择商品" :visible="goodsSelectPickerVisible" :select-goods-rows="selectGoodsRows"
                            @close="goodsSelectPickerVisible = false" @confirm="onGoodsSelectConfirm"/>
    <p-goods-select-pricker title="选择商品" :visible="spikeGoodsSelectPickerVisible"
                            :select-goods-rows="selectOptions.spike.goods"
                            @close="spikeGoodsSelectPickerVisible = false" @confirm="onSpikeGoodsSelectConfirm"/>
    <p-material-upload-modal @confirm="onUploadImage" :select-max="1" :visible.sync="materialSelectPickerVisible"
                             :material-type="1"/>
    <div class="page-preview">
      <div class="page-preview-head"></div>
      <div class="page-preview-head-bg">
        <div class="search">
          <div class="btn">
            <span>搜索</span>
          </div>
        </div>
        <div @click="onSelected('banner')" :class="{'page-preview-item-active':selectKey === 'banner'}"
             class="page-preview-item">
          <div class="page-home-preview-adv">
            <div v-if="bannerRows.length ===0" class="empty">
              <div>点击编辑广告位</div>
              <div>建议尺寸686*280</div>
            </div>
            <a-carousel :autoplay="true" v-else>
              <img width="126" height="126" v-for="(ele,index) in bannerRows" :key="index"
                   :src="ele.image">
            </a-carousel>
          </div>
          <div v-show="selectKey === 'banner'" class="page-preview-item-edit">
            <div class="page-preview-item-edit-title">
              <span>广告位</span>
              <div class="page-preview-item-edit-arrow"></div>
            </div>
            <div class="page-preview-item-edit-hint">
              <span class="hint-label">添加图片：</span>
              <span class="hint-text">最多添加10个广告，鼠标拖拽调整广告顺序</span>
            </div>
            <div v-for="(ele,index) in bannerRows" :key="index" class="page-preview-item-edit-image-item">
              <div @click="onDeleteBanner(index)" class="edit-image-item-close">
                <a-icon type="close-circle"/>
              </div>
              <div class="edit-image-item-left">
                <img :src="ele.image"/>
                <!-- <div class="button">
                     修改图片
                 </div>-->
              </div>
              <div class="edit-image-item-right">
                <div>
                  <label style="width: 20%">标题：</label>
                  <a-input v-model="ele.title" style="width: 80%"/>
                </div>
                <div style="display: flex;">
                  <label>连接：</label>
                  <div style="flex: 1" @click="()=>{
                                      pageSelectPickerVisible = true
                                      currentIndex = index
                                    }">
                    <span v-if="ele.link === null">选择跳转到的页面</span>
                    <div style="display: flex;justify-content: space-between" v-else>
                      <a class="line1">{{ ele.link.name }}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="bannerRows.length<10" @click="materialSelectPickerVisible=true"
                 class="page-preview-item-edit-image-add">
              <div class="image-add-btn">
                <div class="">+ 添加广告图片</div>
                <div>建议尺寸686*280</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('navigator')" :class="{'page-preview-item-active':selectKey === 'navigator'}"
           class="page-preview-item">
        <div class="page-preview-navigator">
          <template v-if="navigatorRows.length === 0">
            <div class="nav-item">
              <div class="img">
                <div class="empty-img">
                  <a-icon type="picture" style="font-size: 24px"/>
                </div>
              </div>
              <span>导航1</span>
            </div>
            <div class="nav-item">
              <div class="img">
                <div class="empty-img">
                  <a-icon type="picture" style="font-size: 24px"/>
                </div>
              </div>
              <span>导航2</span>
            </div>
            <div class="nav-item">
              <div class="img">
                <div class="empty-img">
                  <a-icon type="picture" style="font-size: 24px"/>
                </div>
              </div>
              <span>导航3</span>
            </div>
            <div class="nav-item">
              <div class="img">
                <div class="empty-img">
                  <a-icon type="picture" style="font-size: 24px"/>
                </div>
              </div>
              <span>导航4</span>
            </div>
            <div class="nav-item">
              <div class="img">
                <div class="empty-img">
                  <a-icon type="picture" style="font-size: 24px"/>
                </div>
              </div>
              <span>导航5</span>
            </div>
          </template>
          <template v-else>
            <div v-for="(ele,index) in navigatorRows" :key="index" class="nav-item">
              <div class="img">
                <img :src="ele.image">
              </div>
              <span>{{ ele.title }}</span>
            </div>
          </template>
        </div>
        <div v-show="selectKey === 'navigator'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>图文导航</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加图片：</span>
            <span class="hint-text">最多添加10个导航，不支持鼠标拖拽调整导航顺序</span>
          </div>
          <div v-for="(ele,index) in navigatorRows" :key="index" class="page-preview-item-edit-image-item">
            <div @click="onDeleteNavigator(index)" class="edit-image-item-close">
              <a-icon type="close-circle"/>
            </div>
            <div class="edit-image-item-left">
              <img :src="ele.image"/>
              <div class="button">
                修改图片
              </div>
            </div>
            <div class="edit-image-item-right">
              <div>
                <label style="width: 20%">标题：</label>
                <a-input v-model="ele.title" style="width: 80%"/>
              </div>
              <div style="display: flex;">
                <label>连接：</label>
                <div style="flex: 1" @click="()=>{
                                      pageSelectPickerVisible = true
                                      currentIndex = index
                                    }">
                  <span v-if="ele.link === null">选择跳转到的页面</span>
                  <div style="display: flex;justify-content: space-between" v-else>
                    <a class="line1">{{ ele.link.name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="bannerRows.length<10" @click="materialSelectPickerVisible=true"
               class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 添加导航图标</div>
              <div>建议尺寸88*88</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('adv1')" :class="{'page-preview-item-active':selectKey === 'adv1'}"
           class="page-preview-item">
        <div class="page-home-preview-adv">
          <div v-if="adv1===null" class="empty">
            <div>点击编辑广告位</div>
            <div>建议尺寸486*240</div>
          </div>
          <img style="width: 100%" height="126" v-else :src="adv1.image"/>
        </div>
        <div v-show="selectKey === 'adv1'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>广告位</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加图片：</span>
            <span class="hint-text">大图广告位</span>
          </div>
          <div v-if="adv1!==null" class="page-preview-item-edit-image-item">
            <div class="edit-image-item-left">
              <img :src="adv1.image"/>
              <div @click="materialSelectPickerVisible=true" class="button">
                修改图片
              </div>
            </div>
            <div class="edit-image-item-right">
              <div>
                <label style="width: 20%">标题：</label>
                <a-input v-model="adv1.title" style="width: 80%"/>
              </div>
              <div style="display: flex;">
                <label>连接：</label>
                <div style="flex: 1" @click="()=>{
                                      pageSelectPickerVisible = true
                                    }">
                  <span v-if="adv1.link === null">选择跳转到的页面</span>
                  <div style="display: flex;justify-content: space-between" v-else>
                    <a class="line1">{{ adv1.link.name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="adv1=== null" @click="materialSelectPickerVisible=true"
               class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 设置广告位</div>
              <div>建议尺寸486*240</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('spike')" :class="{'page-preview-item-active':selectKey === 'spike'}"
           class="page-preview-item">
        <div class="page-preview-spike">
          <div class="page-preview-spike-head">
            <div class="page-preview-spike-head-title">{{ skpieTitle }}</div>
            <div class="page-preview-spike-head-link">查看全部></div>
          </div>
          <div class="page-preview-spike-content">
            <template v-if="selectOptions.spike.goods.length === 0">
              <div class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img empty"></div>
                <div class="page-preview-spike-content-item-title line1">
                  商品名称
                </div>
              </div>
              <div class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img empty"></div>
                <div class="page-preview-spike-content-item-title line1">
                  商品名称
                </div>
              </div>
              <div class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img empty"></div>
                <div class="page-preview-spike-content-item-title line1">
                  商品名称
                </div>
              </div>
              <div class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img empty"></div>
                <div class="page-preview-spike-content-item-title line1">
                  商品名称
                </div>
              </div>
              <div class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img empty"></div>
                <div class="page-preview-spike-content-item-title line1">
                  商品名称
                </div>
              </div>
            </template>
            <template v-else>
              <div v-for="ele in selectOptions.spike.goods" :key="ele.id"
                   class="page-preview-spike-content-item">
                <div class="page-preview-spike-content-item-img">
                  <img width="67" height="67" :src="ele.image"/>
                </div>
                <div class="page-preview-spike-content-item-title line1">
                  {{ ele.title }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-show="selectKey === 'spike'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>商品</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加商品：</span>
            <span class="hint-text">仅支持实物、虚拟、电子卡券商品，不支持鼠标拖拽调整顺序</span>
          </div>
          <a-row type="flex" align="middle">
            <a-col span="3"><label>标题：</label></a-col>
            <a-col span="15">
              <a-input placeholder="商品滚动组件标题" v-model="selectOptions.spike.title"/>
            </a-col>
          </a-row>
          <a-row class="mt10 mb10" type="flex" align="middle">
            <a-col span="3"><label>连接：</label></a-col>
            <a-col span="15">
              <div @click="()=>{
                                      pageSelectPickerVisible = true
                                    }">
                <span v-if="selectOptions.spike.link === null">选择跳转到的页面</span>
                <div style="display: flex;justify-content: space-between" v-else>
                  <a class="line1">{{ selectOptions.spike.link.name }}</a>
                </div>
              </div>
            </a-col>
          </a-row>
          <div class="page-preview-item-edit-goods-list">
            <div v-for="ele in selectOptions.spike.goods" :key="ele.id"
                 class="page-preview-item-edit-goods">
              <img :src="ele.image"/>
              <div @click.stop="onDeleteGoods(ele.id)" class="page-preview-item-edit-goods-close">
                <a-icon type="close-circle" theme="filled" style="font-size: 16px"/>
              </div>
            </div>
          </div>
          <div @click="spikeGoodsSelectPickerVisible = true" class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 添加商品</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('adv2')" :class="{'page-preview-item-active':selectKey == 'adv2'}"
           class="page-preview-item">
        <div class="page-home-preview-adv">
          <div v-if="adv2===null" class="empty">
            <div>点击编辑广告位</div>
            <div>建议尺寸486*240</div>
          </div>
          <img style="width: 100%" height="126" v-else :src="adv2.image"/>
        </div>
        <div v-show="selectKey === 'adv2'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>广告位</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加图片：</span>
            <span class="hint-text">大图广告位</span>
          </div>
          <div v-if="adv2!==null" class="page-preview-item-edit-image-item">
            <div class="edit-image-item-left">
              <img :src="adv2.image"/>
              <div @click="materialSelectPickerVisible=true" class="button">
                修改图片
              </div>
            </div>
            <div class="edit-image-item-right">
              <div>
                <label style="width: 20%">标题：</label>
                <a-input v-model="adv2.title" style="width: 80%"/>
              </div>
              <div style="display: flex;">
                <label>连接：</label>
                <div style="flex: 1" @click="()=>{
                                      pageSelectPickerVisible = true
                                    }">
                  <span v-if="adv2.link === null">选择跳转到的页面</span>
                  <div style="display: flex;justify-content: space-between" v-else>
                    <a class="line1">{{ adv2.link.name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="adv2=== null" @click="materialSelectPickerVisible=true"
               class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 设置广告位</div>
              <div>建议尺寸486*240</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('adv3')" :class="{'page-preview-item-active':selectKey == 'adv3'}"
           class="page-preview-item">
        <div class="page-preview-row">
          <div class="left">
            <div v-if="adv3.length === 0" class="empty">
              <div>点击编辑广告位</div>
              <div>建议尺寸264*280</div>
            </div>
            <img v-else :src="adv3[0].image"/>
          </div>
          <div class="right">
            <div v-if="adv3.length <= 1" class="empty">
              <div>点击编辑广告位</div>
              <div>建议尺寸395*280</div>
            </div>
            <img v-else :src="adv3[1].image"/>
          </div>
        </div>
        <div v-show="selectKey === 'adv3'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>广告位</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加图片：</span>
            <span class="hint-text">大图广告位</span>
          </div>
          <div v-for="(ele,index) in adv3" :key="index" class="page-preview-item-edit-image-item">
            <div class="edit-image-item-left">
              <img :src="ele.image"/>
              <div @click="()=>{
                                      materialSelectPickerVisible = true
                                      currentIndex = index
                                    }" class="button">
                修改图片
              </div>
            </div>
            <div class="edit-image-item-right">
              <div>
                <label style="width: 20%">标题：</label>
                <a-input v-model="ele.title" style="width: 80%"/>
              </div>
              <div style="display: flex;">
                <label>连接：</label>
                <div style="flex: 1" @click="()=>{
                                      pageSelectPickerVisible = true
                                      currentIndex = index
                                    }">
                  <span v-if="ele.link === null">选择跳转到的页面</span>
                  <div style="display: flex;justify-content: space-between" v-else>
                    <a class="line1">{{ ele.link.name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="adv3.length<2" @click="()=>{
                                      materialSelectPickerVisible = true
                                      currentIndex = index
                                    }"
               class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 设置广告位</div>
              <div>请根据左侧尺寸上传广告位</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="onSelected('goods')" :class="{'page-preview-item-active':selectKey == 'goods'}"
           class="page-preview-item">
        <template v-if="selectGoodsRows.length === 0">
          <div class="page-preview-goods-row">
            <div class="page-preview-goods-item">
              <div class="page-preview-goods-item-img page-preview-goods-item-img-empty">
              </div>
              <div class="page-preview-goods-item-title">
                这里显示商品名称，最多显示2行
              </div>
              <div class="page-preview-goods-item-price">
                <div>¥</div>
                <div>99</div>
                <div>.00</div>
              </div>
              <div class="page-preview-goods-item-button">
                <div class="button-container">
                  <span class="button-text">立即购买</span>
                </div>
              </div>
            </div>
            <div class="page-preview-goods-item">
              <div class="page-preview-goods-item-img page-preview-goods-item-img-empty">
              </div>
              <div class="page-preview-goods-item-title">
                这里显示商品名称，最多显示2行
              </div>
              <div class="page-preview-goods-item-price">
                <div>¥</div>
                <div>99</div>
                <div>.00</div>
              </div>
              <div class="page-preview-goods-item-button">
                <div class="button-container">
                  <span class="button-text">立即购买</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="ele in goodsRows" :key="ele.id" class="page-preview-goods-row">
            <div class="page-preview-goods-item">
              <div class="page-preview-goods-item-img">
                <img :src="ele.left.image"/>
              </div>
              <div class="page-preview-goods-item-title">
                {{ ele.left.title }}
              </div>
              <div class="page-preview-goods-item-price">
                <div>¥</div>
                <div>{{ ele.left.price.toDecimalString() }}</div>
              </div>
              <div class="page-preview-goods-item-button">
                <div class="button-container">
                  <span class="button-text">立即购买</span>
                </div>
              </div>
            </div>
            <div v-if="ele.right!==null" class="page-preview-goods-item">
              <div class="page-preview-goods-item-img">
                <img :src="ele.right.image"/>
              </div>
              <div class="page-preview-goods-item-title">
                {{ ele.right.title }}
              </div>
              <div class="page-preview-goods-item-price">
                <div>¥</div>
                <div>{{ ele.right.price.toDecimalString() }}</div>
              </div>
              <div class="page-preview-goods-item-button">
                <div class="button-container">
                  <span class="button-text">立即购买</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-show="selectKey === 'goods'" class="page-preview-item-edit">
          <div class="page-preview-item-edit-title">
            <span>商品</span>
            <div class="page-preview-item-edit-arrow"></div>
          </div>
          <div class="page-preview-item-edit-hint">
            <span class="hint-label">添加商品：</span>
            <span class="hint-text">仅支持实物、虚拟、电子卡券商品，不支持鼠标拖拽调整顺序</span>
          </div>
          <div class="page-preview-item-edit-goods-list">
            <div v-for="ele in selectGoodsRows" :key="ele.id" class="page-preview-item-edit-goods">
              <img :src="ele.image"/>
              <div @click="onDeleteGoods(ele.id)" class="page-preview-item-edit-goods-close">
                <a-icon type="close-circle" theme="filled" style="font-size: 16px"/>
              </div>
            </div>
          </div>
          <div @click="goodsSelectPickerVisible = true" class="page-preview-item-edit-image-add">
            <div class="image-add-btn">
              <div class="">+ 添加商品</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-box>
      <template #content>
        <a-button :loading="saveBtnLoading" @click="onSave" class="p-input-right-5">保存</a-button>
        <a-button :loading="publishBtnLoading" @click="onPublish" type="primary">发布</a-button>
      </template>
    </footer-box>
  </div>
</template>
<script>
/*import UploadCell from '../../components/material/UploadCell'*/
import MaterialUploadModal from '../../components/material/MaterialUploadModal'
import FooterBox from '../../components/FooterBox'
import DecorateService from '../../service/decorate.service'
import common from '../../common/common'

export default {
  name: 'HomeSetting',
  components: {
    FooterBox,
    /*'p-upload-cell': UploadCell,*/
    'p-material-upload-modal': MaterialUploadModal,
  },
  data() {
    return {
      currentIndex: -1,
      saveBtnLoading: false,
      publishBtnLoading: false,
      selectKey: '',
      selectLink: null,
      pageSelectPickerVisible: false,
      goodsSelectPickerVisible: false,
      spikeGoodsSelectPickerVisible: false,
      materialSelectPickerVisible: false,
      selectGoodsRows: [],
      spikeSelectGoodsRows: [],
      bannerRows: [],
      navigatorRows: [],
      adv1: null,
      adv2: null,
      adv3: [],
      selectOptions: {
        banner: [],
        spike: {
          title: '组件名称',
          link: null,
          goods: []
        },
        navigator: [],
        adv1: null,
        adv2: null,
        adv3: {},
        goods: []
      }
    }
  },
  computed: {
    goodsRows() {
      if (this.selectGoodsRows.length === 0) return []
      let count = Math.floor(this.selectGoodsRows.length / 2)
      if (this.selectGoodsRows.length % 2 > 0) {
        count += 1
      }
      let list = []
      let lastIndex = 0;
      while (list.length < count) {
        let row = {
          left: null,
          right: null
        }
        for (let i = lastIndex; i < this.selectGoodsRows.length; i++) {
          let t = {
            id: this.selectGoodsRows[i].id,
            image: this.selectGoodsRows[i].image,
            title: this.selectGoodsRows[i].title,
            price: this.selectGoodsRows[i].price
          }
          if (row.left === null) {
            row.left = t
            continue
          }
          if (row.right === null) {
            row.right = t
            lastIndex = i + 1
            break
          }
        }
        list.push(row)
      }
      return list
    },
    skpieTitle() {
      if (this.selectOptions.spike === null) {
        return '组件标题'
      } else {
        return this.selectOptions.spike.title
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    onSelected(key) {
      for (let ele in this.selectOptions) {
        console.log(ele)
        if (ele === key) {
          this.selectKey = key
          return;
        }
      }
    },
    onConfirmLink(e) {
      let link = {
        key: e.key,
        value: e.value,
        name: e.name
      }
      if (this.selectKey === 'banner') {
        this.bannerRows[this.currentIndex].link = link
      }
      if (this.selectKey === 'navigator') {
        this.navigatorRows[this.currentIndex].link = link
      }
      if (this.selectKey === 'adv1') {
        this.adv1.link = link
      }
      if (this.selectKey === 'spike') {
        this.selectOptions.spike.link = link
      }
      if (this.selectKey === 'adv2') {
        this.adv2.link = link
      }
      if (this.selectKey === 'adv3') {
        this.adv3[this.currentIndex].link = link
      }
      this.pageSelectPickerVisible = false
    },
    onGoodsSelectConfirm(rows) {
      for (let ele of rows) {
        if (this.selectGoodsRows.findIndex(x => x.id.toString() === ele.id.toString()) === -1) {
          this.selectGoodsRows.push({
            id: ele.id,
            image: ele.imageUrl.split(',')[0],
            price: ele.minSalePrice,
            title: ele.title
          })
        }
      }
      this.goodsSelectPickerVisible = false
    },
    onSpikeGoodsSelectConfirm(rows) {
      for (let ele of rows) {
        if (this.selectOptions.spike.goods.findIndex(x => x.id.toString() === ele.id.toString()) === -1) {
          this.selectOptions.spike.goods.push({
            id: ele.id,
            image: ele.imageUrl.split(',')[0],
            price: ele.minSalePrice,
            title: ele.title
          })
        }
      }
      this.spikeGoodsSelectPickerVisible = false
    },
    onDeleteGoods(id) {
      if (this.selectKey === 'spike') {
        let index = this.selectOptions.spike.goods.findIndex(ele => ele.id === id)
        if (index > -1) {
          this.selectOptions.spike.goods.splice(index, 1)
        }
      }
      if (this.selectKey === 'goods') {
        let index = this.selectGoodsRows.findIndex(ele => ele.id === id)
        if (index > -1) {
          this.selectGoodsRows.splice(index, 1)
        }
      }
    },
    onDeleteBanner(index) {
      this.bannerRows.splice(index, 1)
    },
    onDeleteNavigator(index) {
      this.navigatorRows.splice(index, 1)
    },
    onUploadImage(files) {
      let image = {
        image: files[0].url,
        title: '',
        link: null
      }
      if (this.selectKey === 'banner') {
        this.bannerRows.push(image)
      }
      if (this.selectKey === 'navigator') {
        image.title = '导航' + (this.navigatorRows.length + 1)
        this.navigatorRows.push(image)
      }
      if (this.selectKey === 'adv1') {
        this.adv1 = image
      }
      if (this.selectKey === 'adv2') {
        this.adv2 = image
      }
      if (this.selectKey === 'adv3') {
        if (this.adv3.length < 2) {
          this.adv3.push(image)
        } else {
          this.adv3[this.currentIndex].image = files[0].url
        }
      }
      this.materialSelectPickerVisible = false
    },
    load() {
      DecorateService.getHomePageConfig().then(res => {
        this.selectOptions = res.data.result
        if (this.selectOptions.hasOwnProperty('spike') === false) {
          this.selectOptions.spike = {
            title: '组件名称',
            link: null,
            goods: []
          }
        }
        this.bannerRows = this.selectOptions.banner
        this.navigatorRows = this.selectOptions.navigator
        this.adv1 = this.selectOptions.adv1
        this.adv2 = this.selectOptions.adv2
        this.adv3 = this.selectOptions.adv3
        this.selectGoodsRows = this.selectOptions.goods
      })
    },
    onSave() {
      this.saveBtnLoading = true
      this.selectOptions.adv1 = this.adv1
      this.selectOptions.adv2 = this.adv2
      this.selectOptions.goods = this.selectGoodsRows
      DecorateService.homePageSave(this.selectOptions).then(res => {
        this.saveBtnLoading = false
        if (common.isSuccess(res)) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    onPublish() {
      this.publishBtnLoading = true
      DecorateService.publish().then(res => {
        this.publishBtnLoading = false
        if (common.isSuccess(res)) {
          this.$message.success('发布成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.page-setting-container {
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 100px;
  margin-bottom: 50px;
}

.page-preview {
  background-color: #f7f8fa;
  box-shadow: 0 0 14px 0 #e8e8e8;
  width: 375px;
  padding-bottom: 20px;

  .page-preview-head {
    height: 64px;
    background-image: url("../../assets/img/page_head.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
  }

  .page-preview-head-bg {
    background-image: url("../../assets/img/preview_home_head_bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100%;
    padding-top: 15px;

    .search {
      height: 36px;
      background: #FFFFFF;
      opacity: 1;
      border-radius: 50px;
      margin-left: 16px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        width: 96/2px;
        height: 48/2px;
        border-radius: 25px;
        background: linear-gradient(90deg, #FD9673 0%, #FA3E38 100%);
        margin-right: 15px;
        text-align: center;

        span {
          color: white;
          font-size: 13px;
        }
      }
    }

    .banner {
      height: 120px;
      box-sizing: border-box;

      & /deep/ .slick-slide {
        text-align: center;
        height: 120px;
        line-height: 120px;
        background: #364d79;
        overflow: hidden;
      }
    }
  }

  .page-preview-navigator {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .nav-item {
      margin-top: 5px;
      text-align: center;
      width: 65px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      .img {
        width: 44px;
        height: 44px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .empty-img {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      span {
        font-size: 12px;
      }
    }
  }

  .page-preview-item {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 10px;
    position: relative;
    cursor: pointer;
  }

  .page-preview-item-active {
    border: 1px solid #1d61d6;
  }

  .page-home-preview-adv {
    height: 126px;
  }

  .empty {
    background-color: #ebf8fd;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #88c4dc;
    font-size: 13px;
  }

  .page-preview-row {
    display: flex;
    justify-content: space-between;
    height: 140px;

    .left {
      width: 134px;

      img {
        width: 134px;
        height: 140px;
      }
    }

    .right {
      width: 195px;

      img {
        width: 195px;
        height: 140px;
      }
    }
  }


  .page-preview-goods-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .page-preview-goods-item {
      width: 167px;
      background-color: white;

      .page-preview-goods-item-img {
        width: 167px;
        height: 167px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .page-preview-goods-item-img-empty {
        background-color: #e8e8e8;
      }

      .page-preview-goods-item-title {
        font-size: 13px;
        margin: 10px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .page-preview-goods-item-price {
        color: red;
        margin: 0 10px;
        display: flex;
        justify-content: center;
      }

      .page-preview-goods-item-button {
        margin: 10px;
        display: flex;
        justify-content: center;

        .button-container {
          color: red;
          width: 95px;
          height: 28px;
          background: #FA3E38;
          opacity: 1;
          border-radius: 10px;
          text-align: center;
          display: flex;
          justify-content: center;

          .button-text {
            color: #FFFFFF;
            line-height: 28px;
          }
        }

      }
    }
  }

  .page-preview-spike {
    background-color: white;
    border-radius: 10px;
    padding-bottom: 10px;

    .page-preview-spike-head {
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;

      .page-preview-spike-head-title {
        font-size: 16px;
        font-weight: bold;
      }

      .page-preview-spike-head-link {
        font-size: 13px;
        color: #8c8c8c;
      }
    }

    .page-preview-spike-content {
      display: flex;
      padding: 0 12px;
      overflow-x: scroll;

      .page-preview-spike-content-item {
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 134/2px;
        max-height: 134/2px;

        .page-preview-spike-content-item-img {
          width: 134/2px;
          height: 134/2px;
        }

        .page-preview-spike-content-item-title {
          margin-top: 5px;
          font-size: 13px;
          color: #8c8c8c;
        }
      }
    }

  }
}

.page-preview-item-edit {
  position: absolute;
  top: 0;
  left: 385px;
  background-color: #f7f8fa;
  padding: 0 10px 10px 10px;
  width: 375px;

  .page-preview-item-edit-title {
    padding: 10px 0;
    text-align: start;
    border-bottom: 1px solid #e5e5dc;
    position: relative;

    .page-preview-item-edit-arrow {
      position: absolute;
      top: 0;
      left: -15px;
      border-color: transparent #ebedf0 transparent transparent;
      border-width: 7px;
    }
  }

  .page-preview-item-edit-hint {
    margin: 15px 0;

    .hint-label {
      font-size: 13px;
    }

    .hint-text {
      font-size: 13px;
      color: #8c8c8c;
    }
  }

  .page-preview-item-edit-image-add {
    background-color: white;
    border: 1px dashed #e5e5e5;
    padding: 20px 0;
    cursor: pointer;

    .image-add-btn {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;


      & :nth-child(1) {
        color: #155bd4;
      }

      & :nth-child(2) {
        color: #8c8c8c;
      }
    }
  }

  .page-preview-item-edit-image-item {
    background-color: white;
    border: 1px dashed #e5e5e5;
    padding: 10px;
    margin-bottom: 15px;
    cursor: pointer;
    display: flex;
    position: relative;

    .edit-image-item-close {
      position: absolute;
      right: -5px;
      top: -10px;
    }

    .edit-image-item-left {
      width: 80px;
      height: 80px;
      background-color: #f2f4f6;
      position: relative;

      img {
        width: 80px;
        height: 80px;
      }

      .button {
        position: absolute;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        height: 20px;
        width: 80px;
        color: white;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
      }
    }

    .edit-image-item-right {
      margin-left: 20px;
      display: flex;
      font-size: 13px;
      justify-content: space-between;
      flex-direction: column;
    }
  }

  .page-preview-item-edit-goods-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .page-preview-item-edit-goods {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    margin-bottom: 8px;
    background-color: #f2f4f6;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }


    &:hover {
      border: 1px solid #1d61d6;

      .page-preview-item-edit-goods-close {
        display: inline-block;
      }
    }

    .page-preview-item-edit-goods-close {
      display: none;
      background-color: white;
      position: absolute;
      cursor: pointer;
      border-radius: 15px;
      width: 15px;
      height: 15px;
      right: -10px;
      top: -12px;
    }

  }
}
</style>
