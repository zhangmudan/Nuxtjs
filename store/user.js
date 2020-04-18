// 存放仓库该分类（user）下的数据, export const state = {}是固定的格式
export const state = {
  userInfo: {}
};
// 修改state中的数据 export const mutations = {}是固定的格式
// store的数据不能直接修改，必须要使用mutations来修改
export const mutations = {
  // 声明一个函数，函数名可以随便起
  // 该函数有两个参数，第一个参数是上面state(固定的), 第二个参数是传入的参数(不固定)
  setUserInfo(state, data) {
    state.userInfo = data
  }
}
// actions 可以用来存放一些公共的方法,多个组件或者项目通用的方法
// 并且可以调用 mutations 来修改state
export const actions = {
  // 声明一个函数，函数名可以随便起
  // 该函数有两个参数，第一个参数是 store 对象(固定的), 第二个参数是传入的参数(不固定)
  //登录
  login(store, data) {
    return this.$axios({
      url: "/accounts/login",
      data,
      method: "POST"
    }).then(res => {
      // console.log(res);
      const { data } = res;
      // 通过store.commit 调用 mutations 的方法 可以省略user
      store.commit("setUserInfo", data);
      return data
    });
  },
  //手机验证码
  captcha(store, data) {
    return this.$axios({
      url: "/captchas",
      method: "POST",
      data: {
        tel: data
      }
    }).then(res => {
      const { code } = res.data
      return code
    });
  },
  //注册
  register(store, data) {
    return this.$axios({
      url: "/accounts/register",
      method: "POST",
      data
    }).then(res => {
      const { data } = res
      store.commit('setUserInfo', data)
      return data
    });
  }
}