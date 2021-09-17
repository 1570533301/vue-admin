<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <template>
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  v-model="addForm.goods_price"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  v-model="addForm.goods_number"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_number">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                  }"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </template>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in status"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(items, i) in item.attr_vals"
                  :key="i"
                  :label="items"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in statusList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action:图片要上传的地址 -->
            <el-upload
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编译器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="shopBtn" type='primary' @click="addShops">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="ImgdialogVisible" width="50%">
      <img :src="preverPath" class="preverImg">
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  getGoodsShop,
  getGoodsState,
  getGoodsAttribute,
  postGoodsShop
} from '../../api/api.js'
export default {
  data() {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: [],
        goods_introduce:"",
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请写商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请写商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请写商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请写商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      cateList: [],
      //动态参数列表
      status: [],
      statusList: [],
      //图片上传的请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      ImgdialogVisible: false,
      preverPath:''
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    getShopList() {
      getGoodsShop().then((res) => {
        this.cateList = res.data
      })
    },
    handleChange() {},
    beforeTabLeave(activeName, oldName) {
      if (oldName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    tabClicked() {
      if (this.activeIndex === '1') {
        //访问动态参数面板
        getGoodsState(this.CateId).then((res) => {
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals.length
              ? item.attr_vals.split(',')
              : []
          })
          this.status = res.data
        })
      } else if (this.activeIndex === '2') {
        //访问商品属性
        getGoodsAttribute(this.CateId).then((res) => {
          this.statusList = res.data
        })
      }
    },
    // 处理移出图片的操作
    handleRemove(file) {
      //1:获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //2:从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //3:调用数组的splice方法，把图片信息对象，从数组中移出
      this.addForm.pics.splice(i, 1)
    },
    //处理图片预览
    handlePreview(file) {
      this.ImgdialogVisible=true
      this.preverPath=file.response.data.url
    },
    //图片成功之后
    handleSuccess(response) {
      //拼接得到一个信息对象
      const picInfo = { pic: response.data.tmp_path }
      //将图片信息对象添加到数组
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    addShops(){
      this.$refs.addFormRef.validate(valid=>{
        if(!valid) return this.$message.error('请填写商品信息')
       //请求之前进行深拷贝
       const form = _.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        //处理动态参数和静态属性
        this.statusList.forEach(item=>{
          const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
         this.status.forEach(item=>{
          const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
        console.log(form);
        postGoodsShop(form).then(res=>{
          this.$router.push('/goods')
        })
     })
    }
  },
  computed: {
    CateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style scoped>
.el-tabs {
  margin-top: 15px;
  font-size: 16px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.preverImg{
  width: 100%;
}
.shopBtn{
  margin: 15px 0;
}
</style>