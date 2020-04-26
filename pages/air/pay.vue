<template>
  <div class="container">
    <div class="main">
      <!-- Number().toFixed(2) 保留2位小数点 -->
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{ Number(list.price).toFixed(2) }}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="pay-qrcode"
        >
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt="" />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 生成二维码的包
import QRCode from "qrcode";
export default {
  data() {
    return {
      list: {},
      timeId: ""
    };
  },
  mounted() {
    //把setTimeout 的函数设置成async函数,函数内部可以使用await来同步执行代码
    setTimeout(async () => {
      //await 的返回值就是then 的函数的参数(res)
      const res = await this.$axios({
        url: "/airorders/" + this.$route.query.id,
        headers: {
          // 这里千万要注意Bearer 后面必须要有一个空格（基于JWT标准）
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      });
      // console.log(res);
      this.list = res.data;
      const canvas = document.querySelector("#qrcode-stage");
      // 第一个参数canvas节点元素
      // 第二个是生成二维码的链接
      QRCode.toCanvas(canvas, this.list.payInfo.code_url, { width: 200 });
      this.timeId = setInterval(async () => {
        const checkRes = await this.$axios({
          url: "/airorders/checkpay",
          data: {
            id: this.list.id,
            nonce_str: this.list.price,
            out_trade_no: this.list.orderNo
          },
          method: "POST",
          headers: {
            // 这里千万要注意Bearer 后面必须要有一个空格（基于JWT标准）
            Authorization: `Bearer ` + this.$store.state.user.userInfo.token
          }
        });
        if (checkRes.data.statusTxt === "支付完成") {
          this.$message.success("订单支付完成");
          //停止定时器
          clearInterval(this.timeId);
          this.$router.push("/air");
        }
      }, 3000);
    }, 0);
  },
  //如果组件被卸载或者销毁后(也就是页面切换后),同时也要销毁定时器
  destroyed() {
    //停止定时器
    clearInterval(this.timeId);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
