import { getToken,setToken,removeToken } from '@/utils/auth'

const state={
  // 从缓存中读取初始值
  token:getToken()
}

const mutations={
  setToken(state,token){
    state.token=token
    // 同步到缓存
    setToken(token)
  },
  removeToken(){
    // 删除vuex中的token
    removeToken()
  }
}

const actions={
  login(context,data){
    console.log(data);
    // 调用登录接口
    context.commit('setToken','123456')
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}