<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <tree-table
        class="tree_table"
        :data="CateList"
        :columns="columns"
        show-index
        :selection-type="false"
        :expand-type="false"
        border
        index-text="#"
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            class="el-icon-success"
            v-if="!scope.row.cat_delete"
          ></i>
          <i style="color: lightgreen" class="el-icon-error" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CateObj.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="CateObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="AdddialogVisible"
      width="50%"
      @close="AddCateClose"
    >
      <el-form
        :model="addCateForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            v-model="value"
            clearable
            :options="FatherList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateColse">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editCateclose"
    >
      <el-form
        :model="addCateForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alleditCateclose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  getFatherCategories,
  getNewCategories,
  deleteCategories,
  putNewCategories,
} from '../../api/api.js'
export default {
  data() {
    return {
      CateList: [],
      editdialogVisible: false,
      //查询条件
      CateObj: {
        pagenum: 1,
        pagesize: 5,
      },
      //总数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //表示当前定义为模板列
          type: 'template',
          //表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      AdddialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      FatherList: [],
      //选中的父级分类的id数组
      value: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    //请求数据
    getCategoriesList() {
      getCategories(this.CateObj).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('请求数据失败')
        console.log(res)
        this.CateList = res.data.result
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.CateObj.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange(val) {
      this.CateObj.pagenum = val
      this.getCategoriesList()
    },
    //添加分类
    addCate() {
      this.AdddialogVisible = true
      this.getFatherList()
    },
    //获取父级分类数据列表
    getFatherList() {
      getFatherCategories().then((res) => {
        this.FatherList = res.data
      })
    },
    //选择项发生改变的时候
    parentCateChange() {
      //如果value数组中的length大于0，就说明发生了改变
      if (this.value.length > 0) {
        this.addCateForm.cat_pid = this.value[this.value.length - 1]
        this.addCateForm.cat_level = this.value.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateColse() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return
        getNewCategories(this.addCateForm).then((res) => {
          this.getFatherList()
        })
      })
      this.AdddialogVisible = false
    },
    //监听对话框的关闭事件
    AddCateClose() {
      this.$refs.addForm.resetFields()
      this.value = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_id = 0
      this.addCateForm.cat_name = ''
    },
    //编辑
    editCate(item) {
      this.editdialogVisible = true
      this.addCateForm = item
    },
    //监听编辑关闭对话框
    editCateclose() {
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_id = 0
      this.addCateForm.cat_name = ''
    },
    //监听编辑确定后
    alleditCateclose() {
      putNewCategories(this.addCateForm.cat_id, {
        cat_name: this.addCateForm.cat_name,
      }).then((res) => {
        this.getCategoriesList()
      })
      this.editdialogVisible = false
    },
    //删除
    deleteCate(id) {
      console.log(id);
      this.$confirm('确定要永久删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //发送网络请求
          deleteCategories(id).then((res) => {
            this.getCategoriesList()
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
  },
}
</script>

<style scoped>
.tree_table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>