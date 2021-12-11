<template>
  <div class="material-upload-modal" v-if="visible">
    <div class="ant-modal-mask"></div>
    <div v-show="panelVisible" class="ant-modal-wrap">
      <div style="width: 885px;" class="ant-modal">
        <div class="ant-modal-content">
          <button @click="onClosed" type="button" aria-label="Close" class="ant-modal-close">
            <a-icon class="ant-modal-close-x" type="close"></a-icon>
          </button>
          <div class="ant-modal-header">
            <div class="ant-modal-title">
              <span class="text-title">选择图片</span>
              <a-divider type="vertical"/>
              <router-link tag="span" to="/material" class="link">
                <span style="margin-right: 3px">素材管理</span>
                <a-icon type="right"/>
              </router-link>
            </div>
          </div>
          <div class="ant-modal-body">
            <div class="group-list">
              <div class="text-title">图片分组</div>
              <div class="group-root-node">
                <a-icon v-if="rootNode.collapse===false" @click="onNodeCollapse"
                        style="margin-right: 8px" type="caret-down"></a-icon>
                <a-icon v-else @click="onNodeCollapse" style="margin-right: 8px"
                        type="caret-up"></a-icon>
                <span
                    :class="{'group-node-active':rootNode.active}"
                    @click="onNodeSelected(rootNode)"
                    @mouseout="onNodeActive(rootNode)"
                    @mouseover="onNodeActive(rootNode)"
                    style="display: inline-block;width: 85%;line-height: 24px">
                                    <div style="display: inline-block">
                                        <span>{{ rootNode.name }}</span>
                                        <span> ({{ rootNode.total }})</span>
                                    </div>
                                </span>
              </div>
              <template v-for="group in groups.filter(x=>x.id>0)">
                <div :key="group.id" v-show="rootNode.collapse===false"
                     @click="onNodeSelected(group)"
                     @mouseout="onNodeActive(group)"
                     @mouseover="onNodeActive(group)"
                     :class="{'group-child-node':true,'group-node-active':group.active}">
                  <span>{{ group.name }}</span>
                  <span>({{ group.total }})</span>
                </div>
              </template>

            </div>
            <div class="content">
              <div class="toolbox">
                <div class="filter-input">
                  <label>排序规则</label>
                  <a-select v-model="sortName" @change="onSortChange" style="width: 120px">
                    <a-select-option class="select-item-text" value="updateDate">按更新时间
                    </a-select-option>
                    <a-select-option class="select-item-text" value="createDate">按上传时间
                    </a-select-option>
                    <a-select-option class="select-item-text" value="name">按图片名称</a-select-option>
                  </a-select>
                </div>
                <div class="filter-input">
                  <a-select style="width: 100px" class="search-select" v-model="searchType">
                    <a-select-option class="select-item-text" value="material">
                      图片名称
                    </a-select-option>
                    <a-select-option class="select-item-text" value="group">
                      分组名称
                    </a-select-option>
                  </a-select>
                  <a-input v-model="searchValue" class="search-input"/>
                  <a-button @click="onSearch" class="search-button">搜索</a-button>
                </div>
              </div>
              <div class="material-list">
                <div @click="onMaterialSelected(material)" v-for="material in materials" :key="material.url"
                     class="material-item">
                  <div class="img-box">
                    <img :src="material.url">
                    <div
                        v-if="material.active"
                        class="size">{{ material.imageSize }}
                    </div>
                  </div>
                  <div class="text-box">{{ material.name }}</div>
                  <div v-show="material.checked" class="active">
                    <span></span>
                  </div>
                </div>
              </div>
              <div style="text-align: right;padding-top: 10px; margin-right: 25px;">
                <a-pagination v-model="pageOptions.pageIndex"
                              :total="pageOptions.pageTotal"
                              @change="onPageNext"
                              :defaultPageSize="pageOptions.pageSize" show-less-items/>
              </div>
            </div>
          </div>
          <div class="ant-modal-footer">
            <a-row type="flex" justify="space-between">
              <a-col>
                <a-button @click="()=>{
                                    panelVisible=false
                                    uploadVisible = true
                                }" style="text-align: left !important;">上传图片
                </a-button>
              </a-col>
              <a-col>
                <a-button @click="onConfirm" type="primary">确认</a-button>
                <a-button @click="onClosed">取消</a-button>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>

    <div v-show="uploadVisible" class="ant-modal-wrap">
      <div style="width: 885px;" class="ant-modal">
        <div class="ant-modal-content">
          <button @click="()=>{
                            panelVisible = true
                            uploadVisible = false
                        }" type="button" aria-label="Close" class="ant-modal-close">
            <a-icon class="ant-modal-close-x" type="close"></a-icon>
          </button>
          <div class="ant-modal-header">
            <div class="ant-modal-title">
              <span class="text-title">上传图片</span>
            </div>
          </div>
          <div class="ant-modal-body">
            <div style="width: 100%;">
              <a-row style="margin-bottom: 25px" type="flex">
                <a-col style="text-align: right;margin-right: 20px" span="4">上传至分组</a-col>
                <a-col span="15">
                  <a-select style="width: 100%" v-model="selectedGroup">
                    <template v-for="(item,index) in groups">
                      <a-select-option v-if="item.id>0" :key="index" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </template>
                  </a-select>
                </a-col>
              </a-row>
              <a-row style="margin-bottom: 25px" type="flex">
                <a-col style="text-align: right;margin-right: 20px" span="4">上传图片</a-col>
                <a-col span="10">
                  <a-upload accept=".bmp,.png,.jpeg,.jpg,.gif" :multiple="true" name="file"
                            :file-list="uploadFileList"
                            :action="uploadUrl" @change="onUploadImageChange"
                            list-type="picture-card">
                    <div v-if="uploadFileList.length < 10">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">
                        本地上传
                      </div>
                    </div>
                  </a-upload>
                </a-col>
              </a-row>
              <a-row type="flex">
                <a-col style="color: #9797a1" offset="4" span="20">
                  <p>注意： 1. 图片上传支持bmp、png、jpeg、jpg、gif格式；</p>
                  <p style="padding-left: 45px">2. 图片最大支持5M；</p>
                  <p style="padding-left: 45px">3. 最多上传10张图片；</p>
                </a-col>
              </a-row>
            </div>

          </div>
          <div class="ant-modal-footer">
            <a-button @click="onSubmitImages" type="primary">确认</a-button>
            <a-button @click="()=>{
                            panelVisible = true
                            uploadVisible = false
                        }">取消
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MaterialApi from '../../service/material.service'
import common from '../../common/common'

export default {
  name: 'MaterialUploadModal',
  props: {
    visible: Boolean,
    materialType: Number,
    selectMax: Number
  },
  data() {
    return {
      pageOptions: {
        pageIndex: 1,
        pageSize: 30,
        pageTotal: 1
      },
      uploadVisible: false,
      panelVisible: true,
      selectGroupId: -1,
      groups: [],
      rootNode: {
        id: -1,
        name: '全部图片',
        total: 2,
        active: true,
        checked: true,
        collapse: false
      },
      sortName: 'createDate',
      searchType: 'material',
      searchValue: '',
      selectedGroup: 0,
      materials: [],
      materialSelected: [],
      uploadFileList: [],
      uploadUrl: process.env.VUE_APP_UPLOAD_URL,
      loading: false
    }
  },
  created() {
    this.getMaterialGroupList(1)
    this.getMaterialList({
      index: 1,
      pageIndex: this.pageOptions.pageIndex,
      pageSize: this.pageOptions.pageSize,
      sort: this.sortName
    })
  },
  methods: {
    onNodeActive(group) {
      if (group.checked) return
      group.active = !group.active
    },
    onNodeSelected(group) {
      this.selectedGroup = group.id
      group.checked = true
      group.active = true
      this.groups.filter(x => x.id !== group.id).forEach(x => {
        x.checked = false
        x.active = false
      });
      if (group.id === -1 && this.searchType === 'group' && this.searchValue.length > 0) return
      let options = null
      this.pageOptions.pageIndex = 1
      if (group.id === -1) {
        options = {
          index: 1,
          pageIndex: this.pageOptions.pageIndex,
          pageSize: this.pageOptions.pageSize
        }
      } else {
        options = {
          index: 1,
          materialGroupId: group.id,
          pageIndex: this.pageOptions.pageIndex,
          pageSize: this.pageOptions.pageSize
        }
      }
      this.getMaterialList(options)
    },
    onPageNext(e) {
      this.pageOptions.pageIndex = e
      this.getMaterialList({
        index: this.materialType,
        pageIndex: this.pageOptions.pageIndex,
        pageSize: this.pageOptions.pageSize,
        materialGroupId: this.selectedGroup
      })
    },
    onNodeCollapse() {
      this.rootNode.collapse = !this.rootNode.collapse
    },
    onMateMilActive(material) {
      material.active = !material.active
    },
    onMaterialSelected(material) {
      if (material.checked === false) {
        if (this.materialSelected.length >= this.selectMax) {
          this.$message.warning('最多选择' + this.selectMax + '个素材')
          return
        }
      }

      material.checked = !material.checked
      if (material.checked) {
        this.materialSelected.push(material)
      } else {
        let index = this.materialSelected.findIndex(x => x.id === material.id)
        this.materialSelected.splice(index, 1)
      }
    },
    onSearch() {
      this.pageOptions.pageIndex = 1
      this.load()
    },
    onSortChange() {
      this.pageOptions.pageIndex = 1
      this.load()
    },
    onConfirm() {
      this.$emit('confirm', this.materials.filter(x => x.checked).map(x => x))
      this.materials.forEach(x => x.checked = false)
      this.materialSelected = []
      this.onClosed()
    },
    load() {
      if (this.searchType === 'material') {
        this.getMaterialList({
          index: this.materialType,
          pageIndex: this.pageOptions.pageIndex,
          pageSize: this.pageOptions.pageSize
        }).then(() => {
          this.getMaterialGroupList(this.materialType, '', this.searchValue)
        })
      } else {
        this.getMaterialGroupList(this.materialType, this.searchValue).then(() => {
          if (this.rootNode.total > 0) {
            let node = this.groups.find(x => x.total > 0 && x.id > -1)
            node.checked = true
            node.active = true
            this.rootNode.checked = false
            this.rootNode.active = false
            this.getMaterialList({
              index: this.materialType,
              pageIndex: 1,
              materialGroupId: node.id,
              pageSize: this.pageOptions.pageSize
            })
          } else {
            this.getMaterialList({
              index: this.materialType,
              pageIndex: 1,
              pageSize: this.pageOptions.pageSize,
              materialGroupId: -1
            })
          }
        })
      }
    },
    getMaterialList(options) {
      return new Promise((resolve, reject) => {
        options.sortName = this.sortName
        if (this.searchType === 'material') {
          options.name = this.searchValue
        }
        MaterialApi.getList(options).then(res => {
          if (res.data.code === 0) {
            this.activeIndex = options.index
            this.materials = res.data.result.list.map(x => {
              return {
                id: x.id,
                name: x.name,
                imageSize: x.imageSize,
                groupId: x.materialGroupId,
                url: x.url,
                fileSize: common.unitConvert.byteToUnit(x.fileSize),
                checked: false,
                active: false,
              }
            })
            this.pageOptions.pageTotal = res.data.result.total
            resolve()
          }
        })
      })
    },
    getMaterialGroupList(index, value = '', materialName = '') {
      return new Promise((resolve, reject) => {
        MaterialApi.getGroupList({group: index, searchName: value, materialName: materialName}).then(res => {
          if (res.data.code === 0) {
            this.groups = res.data.result.map(x => {
              return {
                active: false,
                id: x.groupId,
                name: x.groupName,
                total: x.total,
                selected: false,
              }
            })
            this.selectedGroup = this.groups[0].id
            this.rootNode.name = '全部图片'
            this.rootNode.total = 0
            this.groups.forEach(x => {
              this.rootNode.total += x.total
            })
            this.groups.unshift(this.rootNode)
            resolve()
          }
        })
      })
    },
    onUploadImageChange({file, fileList, event}) {
      if (this.uploadFileList.length > 10) {
        this.$message.warning('图片最多上传10张')
        return
      }

      this.uploadFileList = fileList
    },
    onSubmitImages() {
      if (this.uploadFileList.length <= 0) {
        this.$message.warning('请至少上传1张图片')
        return
      }
      let images = this.uploadFileList.map(x => {
        return {
          name: x.response.result.name,
          fileSize: x.response.result.size,
          url: x.response.result.url,
          imageSize: x.response.result.width + '*' + x.response.result.height,
          groupId: this.selectedGroup
        }
      })
      this.loading = true
      MaterialApi.addImages(images).then(res => {
        if (res.data.code === 0) {
          this.$message.success('上传成功')
          this.loading = false
          this.uploadVisible = false
          this.panelVisible = true
          this.uploadFileList = []
          this.load()
        }
      })
    },
    onClosed() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.material-upload-modal .ant-modal-header {
  border-bottom: 0;
}

.material-upload-modal .ant-modal-title {
  font-size: 12px !important;
}

.material-upload-modal .ant-modal-body {
  font-size: 12px !important;
  display: flex;
}

.material-upload-modal .ant-modal-footer {
  border-top: 0;
}

.link {
  color: #2589ff;
}

.link:hover {
  cursor: pointer;
}

.material-upload-modal .group-list {
  padding-right: 10px;
  border-right: 1px solid #e8e8e8;
  box-sizing: border-box;
  min-width: 150px;
}

.group-root-node {
  margin-top: 10px;
  margin-bottom: 8px;
  cursor: pointer
}

.group-child-node {
  margin-bottom: 9px;
  margin-left: 40px;
  padding-left: 5px;
  color: #595961;
  line-height: 24px;
}

.group-child-node:hover {
  cursor: pointer;
}

.group-node-active {
  background-color: #F2F2F6;
}

.text-title {
  color: #595961;
  font-weight: bold;
}

.material-upload-modal .content {
  width: 700px;
}

.toolbox {
  margin-left: 10px;
}

.toolbox label {
  margin-right: 5px;
  color: #595961;
}

.material-list {
  margin-left: 10px;
  height: 380px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: scroll;
}

.material-list .material-item {
  width: 210px;
  height: 160px;
  border: 1px solid #e3e2e5;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}

.material-item .active {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .6);
  text-align: center;
}


.material-item .active span {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 60px;
  width: 60px;
  margin-left: -30px;
  margin-top: -30px;
  background: url("../../assets/material-active.png") no-repeat 50%;
  background-size: cover;
}


.material-item .img-box {
  position: relative;
}

.material-item .img-box img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.img-box .size {
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  color: #FFFFff;
  line-height: 20px;
  font-size: 14px;
  text-align: center;
  width: 100%;
}

.material-item .text-box {
  line-height: 40px;
  text-align: center;
  color: #595961;
}

.toolbox .filter-input {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 10px;
}

.filter-input .ant-select {
  height: 30px;
  font-size: 12px;
}

.filter-input .search-input {
  border-left: 0 !important;
  border-right: 0 !important;
  border-radius: 0 !important;
  width: 130px;
  font-size: 12px !important;
}

.filter-input /deep/ .ant-select-selection {
  border-radius: 4px 0 0px 4px;
}

.filter-input .search-button {
  border-radius: 0 4px 4px 0;
  font-size: 12px !important;
}

.material-upload-modal .content:after {
  clear: none;
}
</style>
<style>
.select-item-text {
  font-size: 12px !important;
}
</style>
