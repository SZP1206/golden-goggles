<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5,
      },
      categoryList: [],
      total: 0,
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表 [API 1.5.1]
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.categoryList = res.data.result
      this.total = res.data.total
    },
  },
}
</script>

<style lang="less" scoped></style>
