<template>
    <a-modal :visible="visible" :confirm-loading="loading" @ok="handleSuccessEvent" @cancel="handleCancelEvent" title="取消订单">
       <a-row type="flex" style="width: 100%" justify="center">
           <a-row style="width: 100%" type="flex">
               <a-select class="font-size-12" v-model="cancelOption" style="width: 200px">
                   <a-select-option  class="font-size-12" value="0">请选择取消订单理由</a-select-option>
                   <a-select-option  class="font-size-12" value="1">无法联系上买家</a-select-option>
                   <a-select-option  class="font-size-12" value="2">买家误拍或重拍了</a-select-option>
                   <a-select-option  class="font-size-12" value="3">买家没有诚意完成购买</a-select-option>
                   <a-select-option  class="font-size-12" value="4">已通过其他方式付款</a-select-option>
                   <a-select-option  class="font-size-12" value="5">缺货无法交易</a-select-option>
                   <a-select-option  class="font-size-12" value="6">其他</a-select-option>
               </a-select>
           </a-row>
           <a-row  style="margin-top: 15px;width: 100%" type="flex">
               <a-textarea placeholder="200字以内" v-model="cancelMessage"></a-textarea>
           </a-row>
       </a-row>
    </a-modal>
</template>

<script>
export default {
    name: "OrderCancelConfirm"
}
</script>

<style scoped>

</style>
