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

      <!-- 表格 -->
      <tree-table
        index-text="#"
        :data="categoryList"
        :columns="columns"
        :border="true"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <!-- 是否有效的模板列 -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <!-- 排序的模板列 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作的模板列 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategory(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCategory(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
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
      columns: [
        {
          lable: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: 'center',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOK',
          align: 'center',
          headerAlign: 'center',
          width: '150px',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          align: 'center',
          headerAlign: 'center',
          width: '150px',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          align: 'center',
          headerAlign: 'center',
          width: '200px',
        },
      ],
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

    // 编辑商品分类
    editCategory() {},

    // 删除商品分类
    removeCategory() {},
  },
}
</script>

<style lang="less" scoped></style>
