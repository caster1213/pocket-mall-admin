<template>
  <a-modal :title="getTitle" :confirm-loading="loading" @ok="handleOkEvent" @cancel="handleCancelEvent"
           :visible="visible">
    <div v-if="isVerification">
      <a-row class="font-size-12" type="flex">
        <a-space>
          <span>自提时间</span>
          <span>{{ getTimes }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 10px" class="font-size-12" type="flex">
        <a-space>
          <span style="text-align: right">自提人</span>
          <span>{{ name }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 10px;" class="font-size-12" type="flex">
        <a-space>
          <span>自提人电话</span>
          <span>{{ phone }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 10px" class="font-size-12" type="flex">
        <a-space>
          <span>提货码</span>
          <span>{{ phone }}</span>
        </a-space>
      </a-row>
    </div>
    <div v-else>
      <a-row class="font-size-12" type="flex">
        <a-space>
          <span>订单编号</span>
          <span>{{ orderNumber }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 15px" class="font-size-12" type="flex">
        <a-space>
          <span>下单时间</span>
          <span>{{ orderCreateDate }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 15px" class="font-size-12" type="flex">
        <a-space>
          <span>配送地址</span>
          <span>{{ deliver }}</span>
        </a-space>
      </a-row>
      <a-row style="margin-top: 15px" class="font-size-12" type="flex">
        <a-space>
          <span>快递公司</span>
          <a-select style="width: 150px" v-model="expressName" class="font-size-12">
            <a-select-option value="">请选择快递公司</a-select-option>
            <a-select-option v-for="item in expressOption" :key="item.id" :value="item.name">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-space>
      </a-row>
      <a-row style="margin-top: 15px" class="font-size-12" type="flex">
        <a-space>
          <span>快递单号</span>
          <a-input v-model="expressCode" style="width: 150px" class="font-size-12"></a-input>
        </a-space>
      </a-row>
    </div>
  </a-modal>
</template>

<script>

export default {
  name: "OrderDelivery"
}
</script>

<style scoped>

</style>
