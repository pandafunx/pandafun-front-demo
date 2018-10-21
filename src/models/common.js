import modelExtend from 'dva-model-extend'
import config from 'config'
const { prefix } = config

const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchActivityModal (state,{ payload}) {
      window.localStorage.setItem(`${prefix}activityModalVisible`, payload)
      return {
        ...state,
        activityModalVisible: payload,
      }
    },

    switchSignInModal (state,{ payload }) {
      window.localStorage.setItem(`${prefix}signInModalVisible`, payload)
      return {
        ...state,
        signInModalVisible: payload,
      }
    },
  },
}


const pandahomeModel={
  reducers:{
    updateState(state,{payload}){
      return {
        ...state,
        ...payload
      }
    }
  }
}



module.exports = {
  model,
  pandahomeModel
}
