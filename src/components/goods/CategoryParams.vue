<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-cascader
        v-model="selectedCategoryKeys"
        :options="categoryList"
        :props="cascaderProps"
      ></el-cascader>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],

      // 级联选择器选中项
      selectedCategoryKeys: [],

      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.categoryList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 15px 0;
}
</style>
