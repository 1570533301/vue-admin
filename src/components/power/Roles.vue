<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['bdbottom', 'vcenter', index == 0 ? 'bdtop' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i) in item.children"
                  :key="item2.id"
                  :class="['bdtop', 'vcenter', i == 0 ? 'bdtops' : '']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRight2(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18" class="items vcenter">
                    <el-tag
                      closable
                      v-for="items in item2.children"
                      type="warning"
                      :key="items.id"
                      @close="removeRight3(scope.row, items.id)"
                      >{{ items.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="changeRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="AdddialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="RolseObj" label-width="100px">
      <el-form-item label="角色名称">
        <el-input v-model="RolseObj.roleName "></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="RolseObj.roleDesc "></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAddRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editdialogVisible" width="50%">
       <el-form  :model="editObj" label-width="100px">
      <el-form-item label="角色名称">
        <el-input v-model="editObj.roleName "></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="editObj.roleDesc "></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesitem"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showdialogVisible"
      width="50%"
      @close="setRightDialog"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        :props="treeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  getRolesDelete,
  getRightList,
  AddRoles,
  setRoles,
  EditRoleItem,
  DeleteRoles
} from '../../api/api.js'
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      RolseObj:{
        roleName :'',
        roleDesc :''
      },
      editObj:{},
      dialogVisible: false,
      showdialogVisible: false,
      AdddialogVisible:false,
      editdialogVisible:false,
      //树形绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //默认选中的节点
      defkeys: [],
      roleId: '',
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    //获取数据
    getrolesList() {
      getRolesList().then((res) => {
        this.rolesList = res.data
        console.log(res.data)
      })
    },
    //添加角色
    addRoles() {
      this.AdddialogVisible=true
    },
    //点击确定后，成功添加角色
    setAddRole(){
      AddRoles(this.RolseObj).then(res=>{
        console.log(res);
        this.getrolesList()
      })
      this.AdddialogVisible=false
    },
    //点击编辑
    editRole(item) {
      console.log(item)
      this.editObj=item
      this.editdialogVisible=true
    },
    editRolesitem(){
      EditRoleItem(this.editObj).then(res=>{
        this.getrolesList()
      })
      this.editdialogVisible = false
    },
    //点击删除
    removeRole(id) {
      console.log(id)
      DeleteRoles(id).then(res=>{
        this.getrolesList()
      })
    },
    //点击分配权限
    changeRole(role) {
      //获取当前的id
      this.roleId = role.id
      console.log(role)
      getRightList().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
      })
      this.getLeafKeys(role, this.defkeys)
      console.log(this.defkeys);
      this.showdialogVisible = true
    },
    //根据id删除二级对应的权限
    removeRight2(item, id) {
      console.log(item)
      this.$confirm('确定要永久删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          //发送网络请求
          getRolesDelete(`roles/${item.id}/rights/${id}`).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除权限失败')
            item.children = res.data
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //根据id删除三级对应的权限
    removeRight3(item, id) {
      console.log(item)
      this.$confirm('确定要永久删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          //发送网络请求
          getRolesDelete(`roles/${item.id}/rights/${id}`).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除权限失败')
            item.children = res.data
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        //如果当前node节点中不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
      console.log(this.defkeys);
    },
    //监听分配权限的关闭
    setRightDialog() {
      this.defkeys = []
    },
    //点击确定后
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]                                                                                             
      const idStr = keys.join(',')
      console.log(idStr)
      setRoles(`roles/${this.roleId}/rights`, { rids: idStr }).then((res) => {
        console.log(res)
        this.getrolesList()
      })
      this.showdialogVisible = false
    },
  },
}
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
.el-table .el-row {
  margin: 0 50px;
  padding: 10px 0;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-icon-caret-right {
  margin: 0 5px;
}
.bdtops {
  border: none;
}
.items .el-tag {
  margin: 0 6px 12px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>