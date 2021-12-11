<template>
   <span class="ant-upload-picture-card-wrapper">
       <div v-show="this.list.length>0" class="ant-upload-list ant-upload-list-picture-card">
           <draggable v-model="list" @end="onDraggableCompleted">
            <div v-for="(url,index) in list" :key="index" class="ant-upload-list-picture-card-container">
               <span>
                   <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card">
                       <div class="ant-upload-list-item-info">
                           <span>
                               <img class="ant-upload-list-item-image" :src="url">
                           </span>
                       </div>
                       <span class="ant-upload-list-item-actions">
                           <a-icon @click="onDelete(index)" type="delete"></a-icon>
                       </span>
                   </div>
               </span>
           </div>
           </draggable>
       </div>
       <div v-show="getUploadBtnVisible" @click="onOpenMaterialPanel"
            class="ant-upload ant-upload-select ant-upload-select-picture-card">
           <span role="button" class="ant-upload">
               <div>
                   <a-icon type="plus"></a-icon>
                   <div class="ant-upload-text">上传</div>
               </div>
           </span>
       </div>
       <p-material-upload-modal :visible.sync="materialUploadVisible"
                                @confirm="onMaterialUploadConfirm"
                                :select-max="5"
                                :material-type="materialType"></p-material-upload-modal>
        </span>
</template>

<script>
import MaterialUploadModal from "./MaterialUploadModal"
import draggable from 'vuedraggable'

export default {
    name: "UploadCell",
    components: {
        'p-material-upload-modal': MaterialUploadModal,
        draggable
    },
    props: {
        cells: Array,
        uploadMax: Number
    },
    data() {
        return {
            materialUploadVisible: false,
            materialType: 1,
            list: []
        }
    },
    created() {
        this.list = this.cells
    },
    computed: {
        getUploadBtnVisible() {
            return this.uploadMax > this.list.length
        }
    },
    methods: {
        onDelete(index) {
            this.list.splice(index, 1)
            this.$emit('cells', this.list)
        },
        onMaterialUploadConfirm(materials) {
            materials.forEach(x => {
                if (this.list.length >= this.uploadMax) {
                    return
                }
                this.list.push(x.url)
            })
            this.$emit('update:cells', this.list)
        },
        onOpenMaterialPanel() {
            this.materialUploadVisible = true
        },
        onDraggableCompleted() {
          this.$emit('update:cells', this.list)
        }
    }
}
</script>

<style scoped>

</style>
