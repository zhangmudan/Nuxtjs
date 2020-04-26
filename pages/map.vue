<template>
  <div>
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=622d46935167ebb769b70ee6d72adf3f"
    ></script>
    <h2>高德地图</h2>
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    var map = new AMap.Map("container");
  }
};
</script>

<style scoped lang="less">
#container {
  width: 500px;
  height: 500px;
}
</style>
