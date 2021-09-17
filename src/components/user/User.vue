<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              @clear="getUserslists"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserslists"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="UsersList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      ></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column prop="role_name" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="switchChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row.id)"
          ></el-button>
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      width="30%"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addFrom"
        :rules="rulesaddFrom"
        label-width="70px"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--  -->
      <el-form
        :model="editForm"
        :rules="ruleseditFrom"
        label-width="70px"
        ref="editFormRef"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="RoledialogVisible" width="50%" @close='closeRolse'>
      <div>
        <p>当前的用户{{ userInfo.username }}</p>
        <p>当前的角色{{ userInfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  getSwitchstate,
  getNewUsers,
  getIdUsers,
  getIdchange,
  getDelete,
  setRolesList,
  PostRoles
} from '../../api/api.js'

export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9])+/
      if (regEmail.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的邮箱'))
      }
    }
    //验证手机的规则
    var checkPhone = (rule, value, cb) => {
      const regPhone =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的手机号'))
      }
    }
    return {
      UsersList: [],
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      queryInfo: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每一页显示的数据
        pagesize: 2,
      },
      //控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      RoledialogVisible: false,
      //需要被分配权限的用户
      userInfo: {},
      //所有角色的数据列表
      rolesList: [],
      //已经选中的角色id
      selectRoleId:'',
      total: 0,
      //表单的验证规则对象
      rulesaddFrom: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
      //根据id查询到的数据
      editForm: {},
      //修改的表单验证
      ruleseditFrom: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserslists()
  },
  methods: {
    getUserslists() {
      getUsersList(this.queryInfo).then((res) => {
        this.UsersList = res.data.users
        console.log(this.UsersList)
        console.log(res)
        this.total = res.data.total
      })
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      console.log(`每页 ${val} 条`)
      this.getUserslists()
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserslists()
    },
    switchChange(data) {
      getSwitchstate(`users/${data.id}/state/${data.mg_state}`).then((res) => {
        if (res.meta.status == !200) {
          return this.$message.error('更新用户状态失败！')
        }
        return this.$message.success('更新用户状态成功！')
      })
    },
    //监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //点击确定，添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid)
        if (!valid) return
        //可以发起网络请求
        getNewUsers(this.addFrom).then((res) => {
          console.log(res)
          if (res.meta.status !== 201)
            return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
        })
      })
      //隐藏添加的对话框
      this.addDialogVisible = false
      //重新获取数据
      this.getUserslists()
    },
    //展示编辑用户的对话框
    showEditDialog(id) {
      this.editDialogVisible = true
      getIdUsers(id).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('数据查询失败')
        this.editForm = res.data
      })
    },
    //监听编辑对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击确定，修改用户信息
    editChange() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        getIdchange(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        }).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功')
        })
      })
      this.getUserslists()
      this.editDialogVisible = false
    },
    //根据id,删除用户
    removeUser(id) {
      //询问用户是否删除
      this.$confirm('确定要永久删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          getDelete('users/' + id).then((res) => {
            this.getUserslists()
            console.log(res)
          })
          //发送网络请求
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //分配角色
    setRole(item) {
      this.userInfo = item
      console.log(this.userInfo);
      //获取所有的角色列表
      setRolesList().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取角色列表失败')
        this.rolesList = res.data
      })
      this.RoledialogVisible = true
    },
    //点击确定后，分配新的角色
    SaveRoleInfo(){
      if(!this.selectRoleId){
        return this.$message.error('请选择角色')
      }
      PostRoles(this.userInfo.id,{rid:Number(this.selectRoleId)}).then(res=>{
        console.log(res);
        this.getUserslists()
        this.RoledialogVisible=false
      })
    },
    //监听关闭分配角色对话框事件
    closeRolse(){
      this.userInfo={}
      this.selectRoleId=''
    }
  },
}
</script>

<style scoped>
.el-table {
  margin: 15px 0 0 0;
}
.el-pagination {
  margin-top: 15px;
}
</style>