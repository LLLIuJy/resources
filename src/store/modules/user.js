import { getToken,setToken,removeToken } from '@/utils/auth'
import {login} from '@/api/user'

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
  removeToken(state){
    // 删除vuex中的token
     state.token = null
    removeToken()
  }
}

const actions={
  async login(context,data){
    console.log(data);
    // 调用登录接口
    const token = await login(data)
    context.commit('setToken',token)
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}