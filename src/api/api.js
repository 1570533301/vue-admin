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
//获取权限列表
export function getRightsList(){
  return request({
    url:'rights/list',
  })
}
//获取角色列表
export function getRolesList(){
  return request({
    url:'roles',
  })
}
//删除角色指定的权限
export function getRolesDelete(url){
  return request({
    url:url,
    method:'delete',
  })
}
//获取所有的权限列表
export function getRightList(){
  return request({
    url:'rights/tree',
  })
}
//角色授权
export function setRoles(url,data){
  return request({
    url,
    data,
    method:'post'
  })
}
//获取角色列表
export function setRolesList(){
  return request({
    url:'roles',
  })
}

//添加角色
export function AddRoles(data){
  return request({
    url:'roles',
    data,
    method:'post'
  })
}
//提交选中后的角色
export function PostRoles(url,data){
  return request({
    url:'users/'+url+'/role',
    data,
    method:'put'
  })
}
//删除角色
export function DeleteRoles(id){
  return request({
    url:'roles/'+id,
    method:'delete'
  })
}
//修改角色后提交
export function EditRoleItem(data){
  return request({
    url:'roles/'+data.id,
    data:{
      roleName:data.roleName,
      roleDesc:data.roleDesc,
    },
    method:'put'
  })
}
//商品分类管理
export function getCategories(data){
  return request({
    url:'categories',
    params:data
  })
}
//获取父级分类的数据列表
export function getFatherCategories(){
  return request({
    url:'categories',
    params:{
      type:2
    }
  })
}
//添加分类
export function getNewCategories(data){
  return request({
    url:'categories',
    method:'post',
    data
  })
}
//提交编辑后的数据
export function putNewCategories(id,data){
  return request({
    url:'categories/'+id,
    method:'put',
    data
  })
}
//删除分类后的数据
export function deleteCategories(id){
  return request({
    url:'categories/'+id,
    method:'delete',
  })
}
//获取静态属性，或者静态参数
export function getCateStatus(id,data){
  return request({
    url:'categories/'+id+'/attributes',
    params:{
      sel:data
    }
  })
}
//添加动态属性
export function postCateStatus(id,data){
  return request({
    url:'categories/'+id+'/attributes',
    data,
    method:'post'
  })
}
//根据id查询
export function CheckCateStatus(id,attid,data){
  return request({
    url:'categories/'+id+'/attributes/'+attid,
    params:data
  })
}
//提交更改后的数据
export function putCateStatus(id,attid,data){
  return request({
    url:'categories/'+id+'/attributes/'+attid,
    data,
    method:'put'
  })
}
//删除
export function deleteCateStatus(id,attid){
  return request({
    url:'categories/'+id+'/attributes/'+attid,
    method:'delete'
  })
}
//保存提交后的参数
export function postCateStatuList(id,attid,data){
  return request({
    url:'categories/'+id+'/attributes/'+attid,
    data,
    method:'put'
  })
}
//请求商品数据
export function getGoodsList(data){
  return request({
    url:'goods',
    params:data,
  })
}
//删除商品
export function DeleteGoods(id){
  return request({
    url:'goods/'+id,
    method:'delete'
  })
}
//添加商品
export function postGoods(data){
  return request({
    url:'goods',
    data,
    method:'post'
  })
}
//获取商品分类
export function getGoodsShop(){
  console.log(1);
  return request({
    url:'categories',
  })
}
//动态参数数据
export function getGoodsState(id){
  console.log(1);
  return request({
    url:'categories/'+id+'/attributes',
    params:{
      sel:'many'
    }
  })
}
//商品属性数据
export function getGoodsAttribute(id){
  return request({
    url:'categories/'+id+'/attributes',
    params:{
      sel:'only'
    }
  })
}
//添加商品
export function postGoodsShop(data){
  return request({
    url:'goods',
    data,
    method:'post'
  })
}
//获取订单
export function getOrders(data){
  return request({
    url:'orders',
    params:data
  })
}
//物流进度
export function getProess(){
  return request({
    url:'/kuaidi/1106975712662'
  })
}
//获取折线图
export function getReport(){
  return request({
    url:'reports/type/1'
  })
}