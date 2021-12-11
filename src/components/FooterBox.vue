<template>
    <div class="page-footer">
        <a-row style="height: 100%" type="flex" justify="center" align="middle">
            <slot name="content"></slot>
        </a-row>
    </div>
</template>

<script>
export default {
    name: "FooterBox"
}
</script>

<style scoped>
.page-footer {
  position: fixed;
  left: 130px;
  right: 10px;
  bottom: 0;
  height: 60px;
  line-height: 30px;
  padding: 8px 10px;
  background-color: #fff;
  box-shadow: 0 2px 10px 0 rgba(15, 12, 70, 0.16);
  /* border-radius: 10px 10px 0 0;*/
}
</style>
