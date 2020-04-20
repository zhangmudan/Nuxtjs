//单独引用
import { Message } from "element-ui";
//plugins 的所有文件都会导入到项目中,并且是全局的
//类似于普通vue项目中的main.js里的内容
//拦截axios错误 暴露一个函数
export default (nuxt) => {
  //onError 在axios请求错误的时候会触发
  nuxt.$axios.onError(
    err => {
      // console.log(err);
      //err.response 是错误对象的详细信息
      const { statusCode, message } = err.response.data;

      // 还未使用
      // if(statusCode === 401 || statusCode === 403){
      //     Message.warning({message: "请先登录"});
      //     redirect("/user/login");
      // }

      if (statusCode === 400) {
        Message.warning({ message });
      }
    }
  )
}