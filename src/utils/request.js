import store from "@/store";
import axios from "axios";
import { Message } from 'element-ui'
import router from '@/router'

const service=axios.create({
  baseURL:process.env.VUE_APP_BASE_API,
  timeout:10000
})

// 请求拦截器
service.interceptors.request.use((config)=>{
  // 注入token
  if(store.getters.token){
    config.headers.Authorization=`Bearer ${store.getters.token}`
  }
  return config
},(error)=>{
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response)=>{
  // axios默认包裹了data
  // 判断是不是Blob
  if (response.data instanceof Blob) return response.data // 返回了Blob对象
  // axios默认封装了data
  const {data,message,success} =response.data
  if(success){
    return data
  }else{
    Message({
      type:'error',
      message
    })
    return Promise.reject(new Error(message))
  }
},async(error)=>{
  if(error.response.status===401){
    Message({
      type:'warning',
      message:"token超时了"
    })
    // 说明token超时了
    await store.dispatch('user/logout')
    // 主动跳转到登录页
    router.push('/login')
    return Promise.reject(error)
  }
  Message({
    type:'error',
    message:error.message
  })
  return Promise.reject(error)
})

export default service