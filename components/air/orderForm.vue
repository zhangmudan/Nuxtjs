<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info" :model="form" :rules="rules">
        <div
          class="member-info-item"
          v-for="(item, index) in form.users"
          :key="index"
        >
          <el-form-item label="乘机人类型">
            <el-input
              placeholder="姓名"
              class="input-with-select"
              v-model="item.username"
            >
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input
              placeholder="证件号码"
              class="input-with-select"
              v-model="item.id"
            >
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers"
        >添加乘机人</el-button
      >
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div v-for="(item, index) in details.insurances" :key="index">
        <div class="insurance-item">
          <el-checkbox
            :checked="false"
            :label="
              `${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`
            "
            border
            @change="hangCheckbox(item.id)"
          >
          </el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit"
          >提交订单</el-button
        >
      </div>
    </div>
    {{ allPrice }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        users: [
          {
            username: "",
            id: ""
          }
        ], //乘机人
        insurances: [], //保险
        contactName: "", //联系人名字
        contactPhone: "", //联系人电话
        captcha: "", //手机验证码
        invoice: false, // 默认不需要发票
        seat_xid: "", //座位
        air: "" //航班id
      },
      details: {}
    };
  },
  computed: {
    //计算总价格
    allPrice() {
      return 123;
    }
  },
  mounted() {
    //获取座位和航班id
    const { seat_xid, id } = this.$route.query;
    // console.log(seat_xid, id);
    this.form.air = id;
    this.form.seat_xid = seat_xid;
    //获取航班详情
    this.$axios({
      url: "/airs/" + id,
      params: {
        seat_xid
      }
    }).then(res => {
      // console.log(res);
      //保险
      this.details = res.data;
      this.$store.commit("air/setFlightData", this.details);
    });
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({
        username: "",
        id: ""
      });
    },
    //选择保险
    hangCheckbox(id) {
      //indexOf 查找数组中是否有该元素,如果有返回该元素,如果没有返回-1
      const index = this.form.insurances.indexOf(id);
      if (index > -1) {
        this.form.insurances.splice(index, 1);
      } else {
        this.form.insurances.push(id);
      }
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      this.$store.dispatch("user/captcha", this.form.contactPhone).then(res => {
        this.$message.success("模拟验证码已发送:" + res);
      });
    },

    // 提交订单
    handleSubmit() {
      // console.log(this.form);
      this.$axios({
        url: "/airorders",
        data: this.form,
        method: "POST",
        headers: {
          // 这里千万要注意Bearer 后面必须要有一个空格（基于JWT标准）
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        console.log(res);
        const { message } = res.data;
        this.$message.success(message);
      });
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
