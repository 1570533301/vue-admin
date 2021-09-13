<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="isShow"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          router
         
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
             v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + items.path"
              v-for="items in item.children"
              :key="items.id"
              @click="saveNavState(item.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getMenuList } from '../api/api.js'
export default {
  data() {
    return {
      //左侧导航数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-406baobiao',
      },
      //是否折叠
      isCollapse: false,
      isShow: false,
      //被激活的链接地址
      activePath:'users'
    }
  },
  created() {
    this.getdata();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    //获取左侧导航数据
    getdata() {
      getMenuList('menus').then((res) => {
        console.log(res.data)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      })
    },
    logout() {
      //清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //点击按钮，保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
}
</script>

<style scoped lang='less'>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: white;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border: none;
}
.toggle_button {
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  background: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>