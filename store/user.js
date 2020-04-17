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