import request from '@/utils/request'

// 登录接口
export function login(data){
  return request({
    url:'/sys/login',
    method:'post',
    data
  })
}

// 获取用户基本资料
export function getUserInfo(){
  return request({
    url:'/sys/profile',
    method:'get'
  })
}

// 修改密码
export function updataPwd(data){
  return request({
    url:'/sys/user/updatePass',
    method:'put',
    data
  })
}