<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">标签一</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">标签二</el-tag>
            <el-tag v-else type="warn">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRightsList } from '../../api/api.js'
export default {
  data() {
    return {
      //权限列表
      rightList: [],
    }
  },
  created() {
    //获取所有权限
    this.getrightList()
  },
  methods: {
    getrightList() {
      getRightsList().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取权限列表失败')
        this.$message.success('获取权限列表成功')
        this.rightList = res.data
      })
    },
  },
}
</script>

<style scoped>
</style>