<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goodsObj.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addShop">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="95px"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scoped.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsObj.pagenum"
        :page-sizes="[5, 20, 30, 35]"
        :page-size="goodsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList,DeleteGoods } from '../../api/api.js'
export default {
  data() {
    return {
      goodsList: [],
      goodsObj: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //请求数据
    getGoodsList() {
      getGoodsList(this.goodsObj).then((res) => {
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('请求商品数据失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    //添加商品
    addShop() {
      this.$router.push('/goods/add')
    },
    handleCurrentChange(val) {
      this.goodsObj.pagenum = val
      this.getGoodsList()
    },
    handleSizeChange(val) {
      this.goodsObj.pagesize = val
      this.getGoodsList()
    },
    deleteGoods(id) {
      this.$confirm('确定要永久删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //发送网络请求
          DeleteGoods(id).then((res) => {
            console.log(res);
            this.getGoodsList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    editGoods() {},
  },
}
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
</style>