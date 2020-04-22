<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件  传备份数据 这样传的数据一直都是完整数据-->
        <FlightsFilters :data="flightsLisCache" @getFilter="getFilter" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem
          v-for="(item, index) in flightsArr"
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
import FlightsFilters from "@/components/air/flightsFilters";
export default {
  data() {
    return {
      //航班总数据
      flightsList: {
        flights: [],
        info: {},
        options: {}
      },
      //备份数据
      flightsLisCache: {
        flights: [],
        info: {},
        options: {}
      },
      pageSize: 5,
      pageIndex: 1,
      total: 0
    };
  },
  components: {
    FlightsItem,
    FlightsListHead,
    FlightsFilters
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // console.log(res);
      this.flightsList = res.data;
      //备份数据不能直接赋值,因为赋值的是同一个内存地址,当上一个更改时,备份数据也会被改
      this.flightsLisCache = { ...res.data };
      this.total = this.flightsList.total;
    });
  },
  computed: {
    // 切割后数据
    flightsArr() {
      const arr = this.flightsList.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageSize * this.pageIndex
      );
      return arr;
    }
  },
  methods: {
    //切换条数,页面数据
    handleSizeChange(val) {
      //显示条数
      this.pageSize = val;
      //切换条数时,当前页应该回到第一页
      this.pageIndex = 1;
    },
    //切换页数,页面数据
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    getFilter(arr) {
      this.flightsList.flights = arr;
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
