<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 数据展示表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="90px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          width="150px"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表 [API 1.8.1]
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // console.log(res.data)
      this.total = res.total
      this.goodsList = res.data.goods
      console.log(this.goodsList)
    },
  },
}
</script>

<style lang="less" scoped></style>