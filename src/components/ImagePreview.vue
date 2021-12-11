<template>
  <div>
    <div class="mask"></div>
    <a-row type="flex" align="center">
      <div>
        <img/>
      </div>
    </a-row>
    <div class="img-tool">
      <div>上一个</div>
      <div>旋转</div>
      <div>下一个</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePreview"
}
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  background-color: black;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.45);
}

.img-tool {
  border-radius: 6px;
  background-color: black;
  position: fixed;
  bottom: 50px;
  left: 50%;
}
</style>
