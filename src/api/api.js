import { request } from "./index";
//登录
export function getLogin(data){
  return request({
    url:'login',
    method:"POST",
    data,
  })
}
//左侧导航
export function getMenuList(){
  return request({
    url:'menus'
  })
}
//获取用户列表
export function getUsersList(data){
  return request({
    url:'users',
    params:data,
  })
}
//保存更改后的用户状态
export function getSwitchstate(data){
  return request({
    url:data,
    method:'put',
  })
}
//添加用户
export function getNewUsers(data){
  return request({
    url:'users',
    method:'post',
    data
  })
}
//根据ID查询用户信息
export function getIdUsers(data){
  return request({
    url:'users/'+data,
  })
}
//编辑用户提交
export function getIdchange(url,data){
  return request({
    url:url,
    data,
    method:'put',
  })
}
//删除单个用户
export function getDelete(url){
  return request({
    url:url,
    method:'delete',
  })
}