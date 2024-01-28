import store from "@/store";
import axios from "axios";
import { Message } from 'element-ui'

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
  Message({
    type:'error',
    message:error.message
  })
  return Promise.reject(error)
})

export default service