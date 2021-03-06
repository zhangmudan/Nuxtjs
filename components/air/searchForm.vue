<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{ active: index === currentTab }"
      >
        <i :class="item.icon"></i>
        {{ item.name }}
      </span>
    </el-row>

    <el-form
      class="search-form-content"
      ref="form"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="出发城市" prop="departCity">
        <!-- fetch-suggestions：获取搜索建议，它的功能就是根据当前输入的关键字，发起请求，把请求的结果显示下拉列表中 -->
        <!-- fetch-suggestions比较类似input事件，有监听作用，不过他可以把数据展示在下拉列表 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="handleBlurDepartSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市" prop="destCity">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handleBlurDestSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间" prop="departDate">
        <!-- change 用户确认选择日期时触发 -->
        <!-- value-format 设置时间的格式 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button
          style="width:100%;"
          type="primary"
          icon="el-icon-search"
          @click="handleSubmit"
          >搜索</el-button
        >
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      },
      rules: {
        departCity: {
          required: true,
          message: "请输入出发城市",
          trigger: "abc"
        },
        destCity: {
          required: true,
          message: "请输入目的城市",
          trigger: "abc"
        },
        departDate: {
          required: true,
          message: "请输入出发日期",
          trigger: "abc"
        }
      },
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      //目的城市列表
      departCityList: [],
      //到达城市列表
      destCityList: [],
      //禁用过期日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      }
    };
  },
  methods: {
    //封装请求城市的方法
    getCities(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        // console.log(data);
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        return newData;
      });
    },
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("当前暂不支持往返机票", "提示", {
          confirmButtonText: "确定"
        });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      if (!value) {
        //禁止输入框的值是空的时候显示下拉框
        cb([]);
        //如果输入框的值为空的话把之前的城市列表删除
        this.departCityList = [];
        return;
      }
      this.$refs.form.validateField("departCity");
      this.getCities(value).then(res => {
        this.departCityList = res;
        cb(res);
      });
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      if (!value) {
        cb([]);
        this.destCityList = [];
        return;
      }
      this.$refs.form.validateField("destCity");
      this.getCities(value).then(res => {
        this.destCityList = res;
        cb(res);
      });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      // console.log(item);
      this.departCode = item.sort;
      this.departCityList = [item];
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.destCode = item.sort;
      this.destCityList = [item];
    },
    //出发城市失去焦点默认选择第一项
    handleBlurDepartSelect() {
      if (this.departCityList.length > 0) {
        this.form.departCity = this.departCityList[0].value;
        this.form.departCode = this.departCityList[0].sort;
      }
    },
    //目标城市失去焦点默认选择第一项
    handleBlurDestSelect() {
      if (this.destCityList.length > 0) {
        this.form.destCity = this.destCityList[0].value;
        this.form.destCode = this.destCityList[0].sort;
      }
    },
    // 确认选择日期时触发
    handleDate(value) {
      this.$refs.form.validateField("departDate");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
    },

    // 提交表单是触发
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // console.log(this.form);
          //把修改仓库数据
          this.$store.commit("air/setSearchList", this.form);
          this.$router.push({
            path: "/air/flights",
            query: this.form
          });
        }
      });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
