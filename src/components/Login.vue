<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        class="login_form"
        :model="loginFrom"
        :rules="loginFormRules"
        ref="loginFromRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-seeuser"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-password"
            v-model="loginFrom.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '../api/api.js'
export default {
  data() {
    return {
      //这是登录表单的数据
      loginFrom: {
        username: 'admin',
        password: '123456',
      },
      //表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //重置登录表单
    resetLoginFrom() {
      this.$refs.loginFromRef.resetFields()
    },
    //表单登录
    login() {
      this.$refs.loginFromRef.validate((valic) => {
        //判断valic的值，是否发起网络请求
        if (!valic) return
        getLogin(this.loginFrom).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败')
          }
          this.$message.success('登录成功')
          //将token保存到缓存中
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      })
    },
  },
}
</script>

<style  scoped lang='less'>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  height: 300px;
  background: #fff;
  width: 450px;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background: #fff;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    background: #eee;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>