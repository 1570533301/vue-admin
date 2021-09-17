<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!--警告区域-->
      <el-alert
        show-icon
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cart_port">
        <el-col>
          <span>选择商品分类 :</span>
          <el-cascader
            expand-trigger="hover"
            v-model="value"
            clearable
            :options="CateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisable" @click="addStatus"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="status" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                   @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数列表"
              prop="attr_name"
            ></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editStatus(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteStatus(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="动态属性" name="only">
          <el-button type="primary" :disabled="isDisable" @click="addStatus"
            >添加属性</el-button
          >
          <el-table :data="statusList" border stripe>
            <el-table-column type="expand">
             <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                   @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editStatus(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteStatus(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 动态添加参数 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="AddStatusdialogVisible"
      width="50%"
      @close="addStatusClose"
    >
      <el-form
        :model="addStatusObj"
        :rules="addStatusFrom"
        ref="AddruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addStatusObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddStatusdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allAddStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="EditStatusdialogVisible"
      width="50%"
      @close="editStatusClose"
    >
      <el-form
        :model="EditStatusObj"
        :rules="EditStatusFrom"
        ref="EditruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditStatusObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditStatusdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allEditStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  deleteCateStatus,
  getCateStatus,
  postCateStatus,
  CheckCateStatus,
  putCateStatus,
  postCateStatuList
} from '../../api/api.js'
export default {
  data() {
    return {
      AddStatusdialogVisible: false,
      EditStatusdialogVisible: false,
      CateList: [],
      //级联选择框双向绑定到的数组
      value: [],
      //级联选择框的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      //动态参数数据
      status: [],
      //动态属性数据
      statusList: [],
      addStatusObj: {
        attr_name: '',
      },
      //验证规则
      addStatusFrom: {
        attr_name: [
          { required: true, message: '请填写动态参数名称', trigger: 'true' },
        ],
      },
      EditStatusFrom: {
        attr_name: [
          { required: true, message: '请填写动态参数名称', trigger: 'true' },
        ],
      },
      EditStatusObj: {},
      inputValue: '',
      inputVisible: false,
    }
  },
  created() {
    this.getCateList()
    this.getdata()
  },
  methods: {
    getCateList() {
      getCategories().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取商品列表失败')
        this.CateList = res.data
        this.getdata()
      })
    },
    //选择项改变的时候，触发改函数
    parentCateChange() {
      this.getdata()
    },
    //获取参数的数据
    getdata() {
      //判断数组的长度,决定是不是三级分类
      if (this.value.length !== 3) {
        this.value = []
        return
      }
      
      //根据所选分类的id，和当前所处于的面板，获取数据
      getCateStatus(this.CateId, this.activeName).then((res) => {
        console.log(res);
        //把字符串分割成数组
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          //控制文本框的显示与隐藏
          item.inputVisible = false
          //文本框输入的值
          item.inputValue = ''
        })
        console.log(res.data)
        if (this.activeName == 'many') {
          this.status = res.data
        } else {
          this.statusList = res.data
        }
      })
    },
    //选中的标签
    handleClick() {
      this.getdata()
    },
    //动态添加参数
    addStatus() {
      this.AddStatusdialogVisible = true
    },
    addStatusClose() {
      this.$refs.AddruleForm.resetFields()
    },
    allAddStatus() {
      this.$refs.AddruleForm.validate((valid) => {
        if (!valid) return
        this.AddStatusdialogVisible = false
        postCateStatus(this.CateId, {
          attr_name: this.addStatusObj.attr_name,
          attr_sel: this.activeName,
        }).then((res) => {
          this.getCateList()
        })
      })
    },
    //编辑
    editStatus(id) {
      this.EditStatusdialogVisible = true
      CheckCateStatus(this.CateId, id, {
        attr_sel: this.activeName,
      }).then((res) => {
        this.EditStatusObj = res.data
      })
    },
    allEditStatus() {
      putCateStatus(this.CateId, this.EditStatusObj.attr_id, {
        attr_name: this.EditStatusObj.attr_name,
        attr_sel: this.activeName,
      }).then((res) => {
        
        this.getCateList()
      })
      this.EditStatusdialogVisible = false
    },
    editStatusClose() {
      this.$refs.EditruleForm.resetFields()
    },
    //删除
    deleteStatus(id) {
      this.$confirm('确定要永久删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //发送网络请求
          deleteCateStatus(this.CateId, id).then((res) => {
            this.getCateList()
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
    //删除
    handleClose(i,item) {
      item.attr_vals.splice(i, 1)
      postCateStatuList(this.CateId,item.attr_id,
      {
        attr_name:item.attr_name,
        attr_sel:item.attr_sel,
        attr_vals:item.attr_vals.join(',')
      }).then(res=>{
        this.getdata()
      })
    },
    //点击按钮，展示文本输入框
    showInput(item) {
      item.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(item) {
      if (item.inputValue.trim()) {
        item.attr_vals.push(item.inputValue.trim())
      }
      item.inputValue = ''
      item.inputVisible = false
      //发起网络请求，保存字据
      postCateStatuList(this.CateId,item.attr_id,
      {
        attr_name:item.attr_name,
        attr_sel:item.attr_sel,
        attr_vals:item.attr_vals.join(',')
      }).then(res=>{
        this.getCateList()
      })
    },
  },
  computed: {
    //监听是否开启点击按钮
    isDisable() {
      if (this.value.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级id
    CateId() {
      if (this.value.length == 3) {
        return this.value[2]
      }
      return null
    },
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style scoped>
.cart_port {
  margin: 15px 0;
}
.el-tag {
  margin: 0 20px;
}
.input-new-tag {
  width: 100px;
}
.el-table{
  margin-top:15px ;
}
</style>