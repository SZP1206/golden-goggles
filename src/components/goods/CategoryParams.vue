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
        placeholder="请选择要操作的分类"
        @change="handleChange"
      ></el-cascader>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="manyParamsList" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini">添加属性</el-button>
          <el-table :data="onlyParamsList" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
      activeName: 'many',
      onlyParamsList: [],
      manyParamsList: [],
    }
  },
  computed: {
    // 是否禁用添加按钮
    isBtnDisabled() {
      if (this.selectedCategoryKeys.length !== 3) {
        return true
      }
      return false
    },
    categoryId() {
      return this.selectedCategoryKeys[this.selectedCategoryKeys.length - 1]
    },
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取分类数据列表 [API 1.6.1]
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.categoryList = res.data
    },

    // 级联选择器 选中项 改变的事件
    handleChange() {
      this.getParamsList()
    },

    // 执行查询分类参数 [API 1.7.1]
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: { sel: this.activeName },
          // eslint-disable-next-line comma-dangle
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('请选择要操作的分类')
      }
      if (this.activeName === 'many') {
        this.manyParamsList = res.data
      } else {
        this.onlyParamsList = res.data
      }
      console.log(this.onlyParamsList)
      console.log(this.manyParamsList)
    },

    // 点击页签
    handleTabClick() {
      this.getParamsList()
    },

    // 展示编辑动态参数或静态属性的对话框
    showEditParamsDialog() {},
  },

  // 删除动态参数或静态属性
  deleteParams() {},
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 15px 0;
}
</style>
