import { getToken,setToken,removeToken } from '@/utils/auth'
import {login,getUserInfo} from '@/api/user'
import { constantRoutes,resetRouter } from '@/router'

const state={
  // 从缓存中读取初始值
  token:getToken(),
  // 用户基本资料
  userInfo:{},
  routes: constantRoutes // 静态路由的数组
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
  },
  setUserInfo(state,userInfo){
    state.userInfo=userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 静态路由 + 动态路由
  }
}

const actions={
  async login(context,data){
    console.log(data);
    // 调用登录接口
    const token = await login(data)
    context.commit('setToken',token)
  },
  // 获取用户基本资料
  async getUserInfo(context){
   const res=await getUserInfo()
   context.commit('setUserInfo',res)
   return res
  },
  // 退出登录
  logout(context){
    context.commit('removeToken')
    context.commit('setUserInfo',{})
     // 重置路由
     resetRouter()
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}