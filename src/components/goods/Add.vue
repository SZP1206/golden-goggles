<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      >
      </el-alert>

      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-tabs v-model="activeIndex" tab-position="left">
        <el-tab-pane label="基本信息" name="0">1</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">2</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">3</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">4</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">5</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // step 和 tab 的联动
      activeIndex: '0',
    }
  },
  created() {},
  methods: {},
}
</script>

<style lang="less" scoped></style>
