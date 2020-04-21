<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem
          v-for="(item, index) in flightsList"
          :key="index"
          :data="item"
        />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
export default {
  data() {
    return {
      //航班总数据
      flights: [],
      pageSize: 5,
      pageIndex: 1,
      total: 0,
      // 切割后数据
      flightsList: []
    };
  },
  components: {
    FlightsItem,
    FlightsListHead
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // console.log(res);
      const { flights } = res.data;
      this.flights = flights;
      this.total = flights.length;
      //[0,1,2,3,4,5,6,7,8].slice(0,5)=[0,1,2,3,4]
      this.flightsList = flights.slice(0, this.pageSize);
    });
  },
  methods: {
    //切换条数,页面数据
    handleSizeChange(val) {
      //显示条数
      this.pageSize = val;
      //切换条数时,当前页应该回到第一页
      this.pageIndex = 1;
      this.flightsList = this.flights.slice((this.pageIndex - 1) * val, val);
    },
    //切换页数,页面数据
    handleCurrentChange(val) {
      this.flightsList = this.flights.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
