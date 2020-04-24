//机票数据
export const state = () => {
  return {
    //历史查询
    searchList: []
  }
}
//同步修改数据
export const mutations = {
  setSearchList(state, data) {
    //把数据加在最前面
    state.searchList.unshift(data)
    if (state.searchList.length > 5) {
      state.searchList.length = 5
    }
  }
}