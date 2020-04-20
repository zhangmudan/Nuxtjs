<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    //确认密码自定义检验规则函数
    //rule 表示当前的规则,这个不需要使用 value 是输入框的值
    //callback 是必须调用,可以传入error对象,实现报错
    const validatePassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      // 表单规则
      rules: {
        username: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        //自定义检验规则
        checkPassword: [{ validator: validatePassWord, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      //手机验证码接口
      if (this.form.username === "") {
        //对部分表单字段进行校验的方法
        this.$refs.form.validateField("username");
        return;
      }
      this.$store.dispatch("user/captcha", this.form.username).then(res => {
        this.$message.success("模拟验证码已发送:" + res);
      });
    },

    // 注册
    handleRegSubmit() {
      //解构数据
      const { checkPassword, ...other } = this.form;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.dispatch("user/register", other).then(res => {
            this.$message.success("注册成功");
            this.$router.replace("/");
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>