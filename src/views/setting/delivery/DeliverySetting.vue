<template>
    <div class="p-container">
        <div class="p-tab-box">
            <ul>
                <li @click="onActivated(1)" :class="{'active':activeIndex===1}">
                    <span>商家配送</span>
                </li>
                <li :class="{'active':activeIndex===2}">
                    <span>同城配送</span>
                </li>
                <li @click="onActivated(3)" :class="{'active':activeIndex===3}">
                    <span>到店自提</span>
                </li>
                <li :class="{'active':activeIndex===4}" @click="onActivated(4)">
                    <span>地址库</span>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: "DeliverySetting",
    data() {
        return {
            activeIndex: 1
        }
    },
    created() {
        this.onActivated(1)
    },
    methods: {
        onActivated(index) {
            this.activeIndex = index
            if(index === 1){
                this.$router.push('/setting/delivery/merchant').then()
            }
            if(index === 3){
                this.$router.push('/setting/delivery/custom').then()
            }
            if(index === 4){
                this.$router.push('/setting/delivery/address').then()
            }
        }
    }
}
</script>

<style scoped>
    @import "../../../assets/css/page-box.css";

    /*.over /deep/  .ant-tabs-ink-bar-animated{
        width: 40px !important;
    }*/

</style>
