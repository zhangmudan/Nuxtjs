<template>
  <div style="width: 1000px; margin: 0 auto; padding: 50px 0;">
    <!-- &plugin=AMap.Driving 加载插件 -->
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=622d46935167ebb769b70ee6d72adf3f&plugin=AMap.Driving,AMap.CitySearch,AMap.Autocomplete"
    ></script>
    <h2>高德地图</h2>
    <!-- gutter 栅格间隙 -->
    <el-row type="flex" align="center" :gutter="80">
      <el-col :span="12">
        <!-- container 中不能添加内容 -->
        <div id="container"></div>
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="驾车" name="first"></el-tab-pane>
          <el-tab-pane label="公交" name="second"></el-tab-pane>
          <el-tab-pane label="步行" name="third"></el-tab-pane>
        </el-tabs>
        <div class="from">
          <el-form>
            <el-form-item>
              <el-input
                placeholder="起点位置"
                v-model="start"
                id="startinput"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="终点位置" v-model="end"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%" @click="handleSeach"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 显示路线规划的面板， 不要在这个div里面加内容 -->
        <div id="panel"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      map: "",
      start: "",
      end: "",
      city: ""
    };
  },
  mounted() {
    // Amap在模板中导入js文件之后就应经是一个全局变量了
    // map是一个地图的对象
    var map = new AMap.Map("container", {
      zoom: 11, //级别
      center: [113.3245904, 23.1066805] //中心点坐标
    });
    this.map = map;
    AMap.plugin("AMap.CitySearch", () => {
      var citySearch = new AMap.CitySearch();
      citySearch.getLocalCity((status, result) => {
        if (status === "complete" && result.info === "OK") {
          // 查询成功，result即为当前所在城市信息
          this.city = result.city;
          this.$alert(`您当前在` + result.city, "提示", {
            confirmButtonText: "确定"
          });
        }
      });
    });
    //输入提示
    var auto = new AMap.Autocomplete({
      input: "startinput"
    });
    // 创建一个 Marker 实例：
    var marker = new AMap.Marker({
      position: new AMap.LngLat(113.381794783, 23.1370046926), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: "广州塔"
    });
    // 创建 AMap.Icon 实例：
    var icon = new AMap.Icon({
      size: new AMap.Size(40, 40), // 图标尺寸
      image: "/images/1.jpg", // Icon的图像
      // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
      imageSize: new AMap.Size(40, 40) // 根据所设置的大小拉伸或压缩图片
    });

    // 将 Icon 实例添加到 marker 上:
    var marker2 = new AMap.Marker({
      position: new AMap.LngLat(113.191098, 23.081027),
      icon: icon, // 添加 Icon 实例
      title: "我的位置"
    });
    //自定义内容
    var content = `<div style="
        width:40px; 
        height: 40px; 
        background: url('/images/1.jpg');
        border-radius: 50%;
        background-size: 100%"></div>`;

    var marker3 = new AMap.Marker({
      content: content, // 自定义点标记覆盖物内容
      position: [113.381794783, 22.9370046926], // 基点位置
      offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
    });
    // 将创建的点标记添加到已有的地图实例：
    map.add([marker, marker2, marker3]);
  },
  methods: {
    handleClick(tab) {
      console.log(tab);
    },
    handleMap() {
      AMap.plugin("AMap.Driving", () => {
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          map: this.map,
          panel: "panel"
        });

        var points = [
          { keyword: this.start, city: this.city },
          { keyword: this.end, city: this.city }
        ];

        driving.search(points, function(status, result) {
          // 未出错时，result即是对应的路线规划方案
        });
      });
    },
    handleSeach() {
      // 在开始规划路线之前呢，先清除掉地图上的其他内容
      this.map = new AMap.Map("container", {
        zoom: 11, //级别
        center: [113.3245904, 23.1066805] //中心点坐标
      });
      // 清空panel路线规划面板内容
      document.querySelector("#panel").innerHTML = "";
      this.handleMap();
    }
  }
};
</script>

<style scoped lang="less">
#container {
  width: 500px;
  height: 500px;
  margin-top: 20px;
}
#panel {
  background-color: white;
  max-height: 250px;
  overflow-y: auto;
  width: 100%;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
