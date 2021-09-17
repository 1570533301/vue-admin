<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--  -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import { getReport } from '../../api/api.js'

import _ from 'lodash'
// 导入echarts
import * as echarts from 'echarts'
export default {
  data() {
    return {
      //需要合并的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    
   //准备数据和配置项
  
    getReport().then((res) => {
      const ressult= _.merge(res.data,this.options)
      myChart.setOption(ressult)
    })
  },
  methods: {},
}
</script>

<style>
</style>