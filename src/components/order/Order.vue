<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="orderObj.query"
            class="input-with-select"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400px">
        </el-table-column>
        <el-table-column prop="order_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="是否付款" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status" type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px">
        </el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.update_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods"
              >编辑</el-button
            >
            <el-button
              type="success"
              icon="el-icon-success"
              size="mini"
              @click="showProess"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderObj.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑后的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="EditClose"
    >
      <el-form
        ref="editformRef"
        :model="editForm"
        :rules="editformRules"
        label-width="80px"
      >
        <el-form-item label="省市区县" prop="address">
          <el-cascader
            :options="citydata"
            v-model="editForm.address"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressA">
          <el-input v-model="editForm.addressA"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="praessdialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in proessInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getProess } from '../../api/api.js'
import Citydata from '../../assets/js/city_data2017_element.js'

export default {
  data() {
    return {
      praessdialogVisible: false,
      proessInfo: [],
      orderObj: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
      },
      orderList: [],
      total: 0,
      editdialogVisible: false,
      editForm: {
        address: [],
        addressA: '',
      },
      editformRules: {
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        addressA: [
          { required: true, message: '请选择详细地址', trigger: 'blur' },
        ],
      },
      citydata: Citydata,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      getOrders(this.orderObj).then((res) => {
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      this.orderObj.pagenum = val
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.orderObj.pagesize = val
      this.getOrderList()
    },
    editGoods() {
      this.editdialogVisible = true
    },
    EditClose() {
      this.editdialogVisible = false
      this.$refs.editformRef.resetFields()
    },
    showProess() {
      getProess().then((res) => {
        this.proessInfo = res.data
        console.log(res.data)
      })
      this.praessdialogVisible = true
    },
  },
}
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>