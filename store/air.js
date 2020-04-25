//机票数据
export const state = () => {
  return {
    //历史查询
    searchList: [],
    //选中机票的详细信息
    flightData: {
      seat_infos: {}
    },
    allPrice: ''
  }
}
//同步修改数据
export const mutations = {
  setSearchList(state, data) {
    //把数据加在最前面
    state.searchList.unshift(data)
    if (state.searchList.length > 5) {
      //控制数组长度
      state.searchList.length = 5
    }
  },
  setFlightData(state, data) {
    state.flightData = data
  },
  setAllPrice(state, data) {
    state.allPrice = data
  }
}