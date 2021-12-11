<template>
    <div>
        <div class="material-menu">
            <ul>
                <li @click="onActivated(1)" :class="{'active':activeIndex===1}">
                    <a-icon theme="filled" style="line-height: 34px;" type="picture"/>
                    <span>图片</span>
                </li>
                <li :class="{'active':activeIndex===2}">
                    <a-icon theme="filled" style=" line-height: 34px;" type="video-camera"/>
                    <span>视频</span>
                </li>
                <li :class="{'active':activeIndex===3}">
                    <a-icon theme="filled" style="line-height: 34px;" type="audio"/>
                    <span>音频</span>
                </li>
                <li :class="{'active':activeIndex===4}">
                    <a-icon theme="filled" style="line-height: 34px;" type="file-text"/>
                    <span>图文</span>
                </li>
            </ul>
        </div>
        <div class="material-menu-body">
            <a-row justify="space-between" class="tool" type="flex">
                <a-col :span="4">
                    <a-button @click="()=> {
                        uploadWindowVisible = !uploadWindowVisible
                        selectedGroup = groups[1].id
                    }" class="tool-upload-btn">上传图片
                    </a-button>
                    <span class="total">图片数量</span>
                    <span class="total-text">{{pageOptions.pageTotal}}</span>
                </a-col>
                <a-col style="margin-right: 15px">
                    <a-input-search @search="onSearchMaterial" v-model="searchMaterialName" style="height: 30px"
                                    placeholder="图片名称">
                        <a-button style="height: 30px" class="r-search-btn"
                                  slot="enterButton">
                            搜索
                        </a-button>
                    </a-input-search>
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px" type="flex">
                <a-col span="21">
                    <a-row class="material-content" type="flex">
                        <a-row justify="space-between" class="toolbox" type="flex">
                            <a-col span="10" class="all">
                                <label>
                                    <a-checkbox v-model="allChecked" @change="onAllChecked"></a-checkbox>
                                    <span class="all-text">全选</span>
                                </label>
                                <a-button class="font-size-12" @click="onBulkDelete"
                                          :disabled="fileSelected.length===0">批量删除
                                </a-button>
                                <a-button class="font-size-12" @click="onBulkDownload"
                                          :disabled="fileSelected.length===0">批量下载
                                </a-button>
                                <a-button class="font-size-12" @click="onBulkMove" :disabled="fileSelected.length ===0">
                                    移动到
                                </a-button>
                                <a-button class="font-size-12" :disabled="fileSelected.length ===0">导出链接</a-button>
                            </a-col>
                            <a-col class="filter">
                                <label>排序规则</label>
                                <a-select @change="onSort" v-model="sortValue" style="">
                                    <a-select-option class="select-item-text" style="font-size: 12px" :value="'name'">
                                        按名称顺序
                                    </a-select-option>
                                    <a-select-option class="select-item-text" :value="'updateDate'">按更新时间
                                    </a-select-option>
                                    <a-select-option class="select-item-text" :value="'createDate'">按上传时间
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row class="img-row" type="flex">
                            <a-row style="width: 100%" v-if="list.length === 0" justify="center" type="flex">
                                <a-col span="12">
                                    <a-empty></a-empty>
                                </a-col>
                            </a-row>
                            <a-col v-for="(item,index) in list" :key="index" class="box">
                                <a-card>
                                    <template slot="cover">
                                        <img
                                                slot="cover"
                                                alt="example"
                                                height="180"
                                                :src="item.url"
                                        />
                                        <span class="size">{{item.imageSize}}</span>
                                    </template>

                                    <a-row justify="space-between" type="flex">
                                        <a-col>{{item.name}}.{{item.suffix}}</a-col>
                                        <a-col>
                                            <a-checkbox @change="onFileSelected(item)"
                                                        v-model="item.selected"></a-checkbox>
                                        </a-col>
                                    </a-row>
                                    <a-row>
                                        <span style="font-size: 12px;color: #BBBBBB;margin-right: 10px">{{item.fileSize}}</span>
                                        <span style="font-size: 12px;color: #BBBBBB;">{{item.uploadDate}}上传</span>
                                    </a-row>
                                    <template slot="actions" class="ant-card-actions">
                                        <a-icon @click="()=>{
                                            updateFile.updateId = item.id
                                            updateFile.groupId = item.groupId
                                            updateFile.updateFileName = item.name
                                            updateFile.suffix = item.suffix
                                            updateImageWindowVisible=true}" type="edit"/>
                                        <a-icon @click="onDownloadFile(item.url)" type="download"/>
                                        <a-icon v-clipboard:copy="item.url" v-clipboard:success="onCopySucceed"
                                                type="disconnect"/>
                                        <a-popconfirm title="确认删除素材？" @confirm="onDeleteConfirm(item.id)">
                                            <a-icon type="delete"/>
                                        </a-popconfirm>
                                    </template>
                                </a-card>
                            </a-col>
                        </a-row>
                    </a-row>
                </a-col>
                <a-col span="3">
                    <a-row class="material-right-group">
                        <div class="title">
                            <span style="font-weight: bold">图片分组</span>
                        </div>
                        <div class="search">
                            <a-input-search @search="onSearchGroup" v-model="searchGroupName" style="height: 30px"
                                            placeholder="分组名称">
                                <a-button class="btn"
                                          slot="enterButton">
                                    搜索
                                </a-button>
                            </a-input-search>
                        </div>
                        <div @mouseover.capture="onGroupNodeShow(rootNode)"
                             @mouseout.capture="onGroupNodeShow(rootNode)"
                             @click="onNodeItemSelected(rootNode)"
                             :class="{'group-list':true,'group-list-item-active':rootNode.active}">
                            <div style="position: relative">
                                <a-icon v-if="rootNode.collapse" @click.stop="onNodeCollapse" type="caret-down"/>
                                <a-icon v-else @click.stop="onNodeCollapse" type="caret-up"/>
                                <span> 全部图片 ({{rootNode.total}})</span>
                                <div v-show="rootNode.active" @mouseover.stop="onGroupNodeMenuShow(rootNode)"
                                     @mouseout.stop="onGroupNodeMenuShow(rootNode)"
                                     style="position: absolute; top: 0;right: 15px;">
                                    <a-icon style="width: 30px; text-align: right" type="menu"/>
                                    <div
                                            v-show="rootNode.menuActive"
                                            style=" padding:8px 0; z-index: 20;background-color: #FFFFff;border-radius: 15px; border:1px solid #E3E2E5; position: absolute;right: 5px;top: 25px">
                                        <a-popover :trigger="'click'"
                                                   :destroyTooltipOnHide="true"
                                                   :getPopupContainer="triggerNode=>{ return triggerNode.parentNode}"
                                                   placement="left">
                                            <template slot="content">
                                                <a-row style="margin:20px 20px 10px 20px;" type="flex"
                                                       justify="center">
                                                    <h4>新建分组名称</h4>
                                                </a-row>
                                                <a-row style="margin-bottom: 25px">
                                                    <a-input style="width: 340px" placeholder="请输入分组名称"
                                                             v-model="groupName" @change="onGroupNameChange"
                                                             :suffix="getGroupNameInputLength"></a-input>
                                                </a-row>
                                                <a-row type="flex" justify="center">
                                                    <a-button :loading="loading" @click="onAddGroup" type="primary">
                                                        确认
                                                    </a-button>
                                                    <a-button @click="()=> groupAddWindow=false"
                                                              style="margin-left: 25px">取消
                                                    </a-button>
                                                </a-row>
                                            </template>
                                            <div
                                                    @mouseover.self="onOverGroupChildItem(10)"
                                                    @mouseout.self="onOutGroupChildItem"
                                                    :class="{'group-list-item-action':true,'group-list-item-active':groupChildrenActionIndex===10}">
                                                添加子分组
                                            </div>
                                        </a-popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-for="(group,index) in groups">
                            <div v-show="rootNode.collapse" :key="index" v-if="group.id>0"
                                 @click="onNodeItemSelected(group)"
                                 @mouseover.capture="onGroupNodeShow(group)"
                                 @mouseout.capture="onGroupNodeShow(group)"
                                 :class="{'group-list-item':true,'group-list-item-active':group.active}">
                                <span>{{group.name}} ({{group.total}})</span>
                                <template v-if="group.name !=='默认分组'">
                                    <div @mouseover.stop="onGroupNodeMenuShow(group)"
                                         @mouseout.stop="onGroupNodeMenuShow(group)"
                                         v-show="group.active"
                                         class="group-list-item-menu">
                                        <a-icon
                                                style="width: 30px; text-align: right" type="menu"/>
                                        <div v-show="group.menuActive"
                                             style="padding:8px 0; z-index: 20;background-color: #FFFFff;border-radius: 15px; border:1px solid #E3E2E5; position: absolute;right: 5px;top: 25px">
                                            <a-popover :trigger="'click'"
                                                       :getPopupContainer="triggerNode=>{ return triggerNode.parentNode}"
                                                       placement="left">
                                                <template slot="content">
                                                    <a-row style="margin:20px 20px 10px 20px;" type="flex"
                                                           justify="center">
                                                        <h4>编辑分组名称</h4>
                                                    </a-row>
                                                    <a-row style="margin-bottom: 25px">
                                                        <a-input style="width: 340px" placeholder="请输入分组名称"
                                                                 v-model="groupName" @change="onGroupNameChange"
                                                                 :suffix="getGroupNameInputLength"></a-input>
                                                    </a-row>
                                                    <a-row type="flex" justify="center">
                                                        <a-button type="primary">确认</a-button>
                                                    </a-row>
                                                </template>
                                                <div
                                                        style="width: 102px"
                                                        @mouseover.self="onOverGroupChildItem(11)"
                                                        @mouseout.self="onOutGroupChildItem"
                                                        :class="{'group-list-item-action':true,'group-list-item-active':groupChildrenActionIndex===11}">
                                                    编辑分组名称
                                                </div>
                                            </a-popover>
                                            <a-popover :trigger="'click'"
                                                       :getPopupContainer="triggerNode=>{ return triggerNode}"
                                                       placement="left">
                                                <template slot="content">
                                                    <a-row style="margin:20px 20px 10px 20px;" type="flex"
                                                           justify="center">
                                                        <h4>您确认要删除分组？</h4>
                                                    </a-row>
                                                    <a-row style="margin-bottom: 25px">
                                                        <span>仅删除分组，组内的素材将纳入默认分组</span>
                                                    </a-row>
                                                    <a-row type="flex" justify="center">
                                                        <a-button @click="onDeleteGroup(group)" :loading="loading"
                                                                  type="primary">确认删除
                                                        </a-button>
                                                    </a-row>
                                                </template>
                                                <div
                                                        @mouseover.self="onOverGroupChildItem(12)"
                                                        @mouseout.self="onOutGroupChildItem"
                                                        :class="{'group-list-item-action':true,'group-list-item-active':groupChildrenActionIndex===12}">
                                                    删除分组
                                                </div>
                                            </a-popover>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </a-row>
                </a-col>
            </a-row>

        </div>
        <a-row justify="end" type="flex">
            <a-col>
                <a-pagination style="margin-top: 15px" v-model="pageOptions.pageIndex" :total="pageOptions.pageTotal"
                              :defaultPageSize="pageOptions.pageSize" @change="onPageNext" show-less-items/>
            </a-col>
        </a-row>
        <a-modal style="min-width: 1200px" @cancel="()=> uploadWindowVisible = !uploadWindowVisible"
                 :visible="uploadWindowVisible" :confirm-loading="loading" @ok="onSubmitImages" title="上传图片">
            <a-row style="margin-bottom: 25px" type="flex">
                <a-col style="text-align: right;margin-right: 20px" span="4">上传至分组</a-col>
                <a-col span="15">
                    <a-select style="width: 100%" v-model="selectedGroup" :defaultValue="defaultSelectGroup">
                        <template v-for="(item,index) in groups">
                            <a-select-option v-if="item.id>0" :key="index" :value="item.id">{{item.name}}
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
        </a-modal>
        <a-modal style="min-width: 600px" :visible="updateImageWindowVisible"
                 @cancel="()=> updateImageWindowVisible = false" :loading="loading" @ok="onUpdateName" title="编辑图片">
            <a-row style="margin-bottom: 25px" type="flex">
                <a-col style="text-align: right;margin-right: 20px" span="4">上传至分组</a-col>
                <a-col span="15">
                    <a-select style="width: 100%" v-model="updateFile.groupId" :defaultValue="defaultSelectGroup">
                        <template v-for="(item,index) in groups">
                            <a-select-option v-if="item.id>0" :key="index" :value="item.id">{{item.name}}
                            </a-select-option>
                        </template>
                    </a-select>
                </a-col>
            </a-row>
            <a-row style="margin-bottom: 25px" type="flex">
                <a-col style="text-align: right;margin-right: 20px" span="4">图片名称</a-col>
                <a-col span="15">
                    <a-input v-model="updateFile.updateFileName" style="width: 100%"
                             :addon-after="'.'+updateFile.suffix"/>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>

<script>
import MaterialApi from '../../service/material.service'
import moment from 'moment'
import common from '../../common/common'
import download from 'downloadjs'

export default {
    name: "Material",
    data() {
        return {
            list: [],
            pageOptions: {
                pageIndex: 1,
                pageSize: 25,
                pageTotal: 1
            },
            groups: [],
            rootNode: {
                active: true,
                id: -1,
                name: '',
                total: 0,
                menuActive: false,
                selected: true,
                collapse: true
            },
            updateFile: {
                updateId: '',
                groupId: '',
                suffix: '',
                updateFileName: ''
            },
            allChecked: false,
            sortValue: 'name',
            searchMaterialName: '',
            searchGroupName: '',
            fileSelected: [],
            selectedGroup: '',
            defaultSelectGroup: '',
            loading: false,
            activeIndex: 1,
            groupActiveIndex: 0,
            groupChildrenActionIndex: 0,
            groupWindow: '',
            groupName: '',
            uploadWindowVisible: false,
            uploadFileList: [],
            updateImageWindowVisible: false,
            uploadUrl: process.env.VUE_APP_UPLOAD_URL
        }
    },
    computed: {
        getGroupNameInputLength() {
            return '' + this.groupName.length + '/12'
        }
    },
    created() {
        this.onActivated(1)
    },
    methods: {
        onActivated(index) {
            this.pageOptions.pageIndex = 1
            this.getMaterialList()
            this.getMaterialGroupList(index)
        },
        onSort() {
            for (const g of this.groups) {
                if (g.selected) {
                    this.onNodeItemSelected(g)
                    return
                }
            }
        },
        onGroupNodeShow(group) {
            if (group.selected) return
            group.active = !group.active
        },
        onGroupNodeMenuShow(group) {
            group.menuActive = !group.menuActive
        },
        onNodeItemSelected(group) {
            for (let item of this.groups) {
                if (item.id !== group.id) {
                    item.selected = false
                    item.active = false
                }
            }
            group.selected = true
            group.active = true
            this.pageOptions.pageIndex = 1
            this.getMaterialList()

        },
        onOverGroupChildItem(index) {
            this.groupChildrenActionIndex = index
        },
        onOutGroupChildItem() {
            this.groupChildrenActionIndex = -1
        },
        onGroupNameChange() {
            if (this.groupName.length > 12) {
                this.groupName = this.groupName.substring(0, this.groupName.length - 1)
            }
        },
        onNodeCollapse() {
            this.rootNode.collapse = !this.rootNode.collapse
        },
        onUploadImageChange({fileList}) {
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
                    this.rootNode.total += this.uploadFileList.length
                    this.uploadWindowVisible = false
                    this.uploadFileList = []
                    this.refreshMaterialList()
                }
            })
        },
        onAddGroup() {
            if (this.groups.findIndex(x => x.name === this.groupName) >= 0) {
                this.$message.warning('分组名称已存在,请重新输入')
                return
            }
            this.loading = true
            MaterialApi.addGroup({name: this.groupName, groupType: this.activeIndex}).then(res => {
                this.loading = false
                if (res.data.code === 0) {
                    let item = {
                        active: false,
                        id: res.data.result,
                        name: this.groupName,
                        total: 0,
                        menuActive: false,
                        selected: false
                    }
                    this.groups.push(item)
                    this.groupName = ''
                    this.groupWindow = false
                    this.list = []
                    this.onNodeItemSelected(item)
                    this.$message.success('添加成功')
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        onDeleteGroup(e) {
            this.loading = true
            MaterialApi.deleteGroup({id: e.id}).then(res => {
                this.loading = false
                if (res.data.code === 0) {
                    let delIndex = this.groups.findIndex(x => x.id === e.id)
                    this.groups.splice(delIndex, 1)
                    this.onNodeItemSelected(this.groups[0])
                }
            })
        },
        onFileSelected(e) {
            if (e.selected) {
                if (this.fileSelected.findIndex(x => x.id === e.id) === -1) {
                    this.fileSelected.push(e)
                }

            } else {
                let delIndex = this.fileSelected.findIndex(x => x.id === e.id)
                this.fileSelected.splice(delIndex, 1)
            }
        },
        onAllChecked() {
            for (let item of this.list) {
                if (this.allChecked) {
                    item.selected = true
                } else {
                    item.selected = false
                }
                this.onFileSelected(item)
            }
        },
        onUpdateName() {
            if (this.updateFile.updateFileName === '') {
                this.$message.warning('请输入名称')
                return
            }
            this.loading = true
            let request = {
                name: this.updateFile.updateFileName,
                groupId: this.updateFile.groupId,
                id: this.updateFile.updateId
            }
            MaterialApi.updateImageName(request).then(res => {
                if (res.data.code === 0) {
                    this.loading = false
                    this.updateImageWindowVisible = false
                    this.$message.success('更新成功')
                    for (const g of this.groups) {
                        if (g.selected) {
                            this.onNodeItemSelected(g)
                            return
                        }
                    }
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        getMaterialList() {
            return new Promise((resolve) => {
                let options = {
                    index: this.activeIndex,
                    sortName: this.sortValue,
                    pageIndex: this.pageOptions.pageIndex,
                    pageSize: this.pageOptions.pageSize,
                }
                let groupCheck = this.groups.find(x => x.selected)
                if (groupCheck !== undefined && groupCheck.id > 0) {
                    options.materialGroupId = groupCheck.id
                }
                if (this.searchMaterialName.length > 0) {
                    options.name = this.searchMaterialName
                }

                MaterialApi.getList(options).then(res => {
                    if (res.data.code === 0) {
                        this.list = res.data.result.list.map(x => {
                            let suffix = x.url.split('.')
                            return {
                                id: x.id,
                                name: x.name,
                                imageSize: x.imageSize,
                                groupId: x.materialGroupId,
                                url: x.url,
                                fileSize: common.unitConvert.byteToUnit(x.fileSize),
                                uploadDate: moment(x.creareDare).format('YYYY-MM-DD'),
                                selected: false,
                                suffix: suffix[suffix.length - 1]
                            }
                        })
                        this.pageOptions.pageTotal = res.data.result.total
                        resolve()
                    }
                })
            })
        },
        getMaterialGroupList(index, value = '', materialName = '') {
            return new Promise((resolve) => {
                MaterialApi.getGroupList({group: index, searchName: value, materialName: materialName}).then(res => {
                    if (res.data.code === 0) {
                        this.groups = res.data.result.map(x => {
                            return {
                                active: false,
                                id: x.groupId,
                                name: x.groupName,
                                total: x.total,
                                menuActive: false,
                                selected: false,
                                childrenMenu: ''
                            }
                        })
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
        onDeleteConfirm(id) {
            MaterialApi.materialDelete({id}).then(res => {
                if (res.data.code === 0) {
                    this.$message.success('删除成功')
                    this.refreshMaterialList()
                }
            })
        },
        onCopySucceed() {
            this.$message.success('复制成功')
        },
        onDownloadFile(url) {
            download(url)
        },
        onBulkDownload() {
            let _this = this
            this.$confirm({
                title: '您已选中' + this.fileSelected.length + '个项目,确认全部下载吗?',
                content: () => <div>
                    <p>确认下载后,不可取消</p>
                    <p>建议下载数量不要太多,以免浏览器任务过多</p>
                </div>,
                onOk() {
                    for (let file of _this.fileSelected) {
                        download(file.url)
                    }
                    _this.fileSelected = []
                }
            })
        },
        onBulkDelete() {
            let _this = this
            this.$confirm({
                title: '您已选中' + this.fileSelected.length + '个项目,确认全部删除吗?',
                content: () => <div>
                    <p>删除已同步微信的图片，微信后台的图片也将一并被删除</p>
                </div>,
                onOk() {
                    let images = _this.fileSelected.map(x => x.id)
                    MaterialApi.materialBulkDelete({materials: images}).then(res => {
                        if (res.data.code === 0) {
                            _this.$message.success('删除成功')
                            _this.refreshMaterialList()
                            _this.fileSelected = []
                        }
                    })
                }
            })
        },
        onBulkMove() {
            let _this = this
            let list = this.groups.filter(x => x.id > 0).map(x => x)
            this.selectedGroup = list[0].id
            this.$confirm({
                title: '您已选中' + this.fileSelected.length + '个项目,将全部移动到以下分组?',
                content: () => {
                    return (
                        <div style="margin-top:20px;">
                            <a-select v-model={_this.selectedGroup} style="width:80%">
                                {
                                    list.map(x => {
                                        return (<a-select-option value={x.id}>{x.name}</a-select-option>)
                                    })
                                }
                            </a-select>
                        </div>)
                },
                onOk() {
                    let files = _this.fileSelected.map(x => x.id)
                    MaterialApi.materialBulkMove({materials: files, groupId: _this.selectedGroup}).then(res => {
                        if (res.data.code === 0) {
                            _this.$message.success('移动成功')
                            _this.refreshMaterialList()
                            _this.selectedGroup = ''
                            _this.fileSelected = []
                        }
                    })
                }
            })
        },
        onSearchGroup(value) {
            this.pageOptions.pageIndex = 1
            this.getMaterialGroupList(this.activeIndex, value).then(() => {
                if (this.groups.length > 1) {
                    this.getMaterialList()
                } else {
                    this.list = []
                }
            })
        },
        onSearchMaterial(value) {
            this.pageOptions.pageIndex = 1
            this.getMaterialList().then(() => {
                this.getMaterialGroupList(this.activeIndex, '', value)
            })
        },
        refreshMaterialList() {
            this.pageOptions.pageIndex = 1
            let g = this.groups.find(x => x.selected)
            this.getMaterialGroupList(this.activeIndex)
            this.onNodeItemSelected(g)
        },
        onPageNext(e) {
            this.pageOptions.pageIndex = e
            this.getMaterialList()
        }
    }
}
</script>

<style scoped>
    /deep/ .ant-input-suffix {
        color: #ccc;
    }

    .material-menu {
        display: flex;
        margin-bottom: 15px;
    }

    .material-menu ul li {
        list-style: none;
        display: inline-block;
        height: 34px;
        color: #9797A1;
        margin-right: 25px;
        padding: 0 15px 0 15px;
        border-radius: 5px;
        cursor: pointer;
    }

    .material-menu ul li span {
        font-size: 14px;
        line-height: 34px;
        padding-left: 5px;
    }

    .material-menu .active {
        background-color: #1890ff;
        color: #FFF;
    }

    .material-menu input {
        height: 30px;
    }

    .material-menu-body {
        background-color: #f2f2f6;
        padding: 10px;
        width: 100%;
        font-size: 12px;
    }

    .material-menu-body .tool {
        background-color: #FFFFff;
        height: 50px;
        border-radius: 5px;
        padding-left: 25px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
    }

    .tool-upload-btn {
        border: 1px solid #2589ff;
        color: #2589ff;
        font-size: 12px;
        width: 90px;
    }

    .tool input {
        height: 40px;
    }

    .tool-upload-btn:hover {
        background-color: #1890ff;
        color: #fff;
    }

    .tool .total {
        font-size: 12px;
        margin-left: 10px;
        margin-right: 5px;
    }

    .tool .total-text {
        font-size: 12px;
        color: #BBB;
    }

    .tool .r-search-btn {
        height: 30px;
        border: 1px solid #E3E2E5;
        font-size: 12px;
    }

    .material-content {
        background-color: #FFFFff;
        border-radius: 5px;
        padding-left: 25px;
        padding-top: 15px;
        height: 100%;
    }

    .material-content .toolbox {
        width: 100%;
    }

    .material-content .toolbox .all-text {
        margin-left: 3px;
        margin-right: 10px;
        font-size: 12px;
    }

    .material-content .toolbox .all button {
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .material-content .toolbox .all button[disabled] {
        color: #E3E2E5 !important;
        opacity: 1;
        background-color: #FFFFff;
    }

    .material-content .toolbox .filter {
        padding-right: 15px;
    }

    .filter label {
        font-size: 12px;
        margin-right: 10px;
    }

    .filter .ant-select {
        width: 120px;
        height: 30px;
        font-size: 12px;
    }

    .material-content .img-row {
        margin-top: 10px;
        width: 100%;
        margin-bottom: 25px;
    }

    .img-row .box {
        width: 20%;
        padding: 0 10px 15px 10px;
    }

    .img-row .box:hover {
        cursor: pointer;
    }

    .img-row .box img {
        object-fit: cover;
    }

    .img-row .box:hover{

    }

    .img-row >>> .ant-card-cover {
        position: relative;
    }

    .img-row >>> .ant-card-body {
        padding: 10px 30px 0 10px;
    }

    .img-row .box .size {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        color: #FFFFff;
        line-height: 20px;
        font-size: 12px;
    }

    .img-row >>> .ant-card-actions {
        background-color: #FFFFff !important;
        border-top: 0;
    }

    .material-right-group {
        margin-left: 10px;
        background-color: #FFFFff;
        border-radius: 5px;
        height: 100%;
    }

    .material-right-group .title {
        padding: 20px 0 10px 16px;
    }

    .material-right-group .title span {
        font-size: 13px;
        font-weight: bold;
    }

    .material-right-group .search {
        padding: 0 15px 0 16px;
    }

    .material-right-group .search .btn {
        height: 30px;
        border: 1px solid #E3E2E5;
        font-size: 12px;
    }

    .group-list {
        padding-left: 16px;
        margin-top: 20px;
        color: #595961;
        white-space: nowrap;
        line-height: 30px;
    }

    .group-list:hover {
        cursor: pointer;
    }

    .group-list-item {
        color: #595961;
        padding-left: 30px;
        line-height: 30px;
        position: relative;
    }

    .group-list-item-menu {
        position: absolute;
        right: 16px;
        top: 0
    }

    .group-list-item:hover {
        cursor: pointer;
    }

    .group-list-item-active {
        background-color: #F2F2F6;
    }

    .group-list-item-action {
        line-height: 30px;
        font-size: 12px;
        padding: 0 15px;
        text-align: left;
    }

    .group-list-item-action:hover {
        cursor: pointer;
    }
</style>

<style>
    .select-item-text {
        font-size: 12px !important;
    }

    .ant-input {
        height: 30px !important;
    }

    :-moz-placeholder {
        font-size: 12px;
    }

    ::-webkit-input-placeholder {
        font-size: 12px;
    }

    ul, p {
        padding: 0;
        margin: 0;
    }

</style>
