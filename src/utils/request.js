import store from "@/store";
import axios from "axios";
import serveStatic from "serve-static";

const service=axios.create({
  baseURL:'/api',
  timeout:10000
})

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

export default service