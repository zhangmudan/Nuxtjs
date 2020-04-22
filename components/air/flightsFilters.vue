<template>
  <div class="filters">
    <el-row
      type="flex"
      class="filters-top"
      justify="space-between"
      align="middle"
    >
      <el-col :span="8">
        单程： {{ data.info.departCity }} - {{ data.info.destCity }} /
        {{ data.info.departDate }}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场">
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型">
          <el-option
            v-for="(item, index) in airSizeList"
            :key="index"
            :label="item.labels"
            :value="item.size"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button
        type="primary"
        round
        plain
        size="mini"
        @click="handleFiltersCancel"
      >
        撤销
      </el-button>
    </div>
    <!-- 只是单纯的为了能够触发computed的filter函数的运行,不需要渲染 -->
    <div v-show="false">{{ filter }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      airSizeList: [
        { labels: "大", size: "L" },
        { labels: "中", size: "M" },
        { labels: "小", size: "S" }
      ]
    };
  },
  props: {
    data: {
      type: Object,
      // 默认是空数组
      default: {}
    }
  },
  computed: {
    filter() {
      const arr = this.data.flights.filter(v => {
        //默认所有条件都是符合的
        let valid = true;
        // 当条件（this.company）有值的时候我们才需要判断，表示用户选择了条件
        // 由于valid变量已经假设所有的数据都是符合条件的
        // 所以是不符合条件的条件的航班，就把valid设置为false，最后就return出false
        // 自然这条数据就不会加入到arr中
        //选择机场
        if (this.airport && v.org_airport_name !== this.airport) {
          valid = false;
        }
        //选择航空公司
        if (this.company && this.company !== v.airline_name) {
          valid = false;
        }
        //选择机型
        if (this.airSize && v.plane_size !== this.airSize) {
          valid = false;
        }
        //选择起飞时间
        if (this.flightTimes) {
          const time = this.flightTimes.split(",");
          const current = v.dep_time.split(":")[0];
          if (+time[0] > +current || +current >= +time[1]) {
            valid = false;
          }
        }

        return valid;
      });

      this.$emit("getFilter", arr);
      return "";
    }
  },
  methods: {
    // 撤销条件时候触发
    handleFiltersCancel() {
      (this.airport = ""), // 机场
        (this.flightTimes = ""), // 出发时间
        (this.company = ""), // 航空公司
        (this.airSize = ""); // 机型大小
      this.$emit("getFilter", this.data.flights);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
