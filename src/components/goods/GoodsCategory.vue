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
          <el-button type="primary" @click="showAddCategoryDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        :border="true"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
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
            @click="showEditCategoryDialog(scope.row)"
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

      <!-- 页码条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      @close="addCategoryDialogClose"
    >
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryFormRules"
        ref="addCategoryForm"
      >
        <el-form-item label="分类名称" label-width="80px" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px">
          <el-cascader
            :options="parentCategoryList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              checkStrictly: true,
            }"
            v-model="selectedCategoryKeys"
            @change="parentCategoryChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCategoryDialogVisible">
      <el-form
        :model="editCategoryForm"
        :rules="addCategoryFormRules"
        ref="editCategoryFormRef"
      >
        <el-form-item label="分类名称" label-width="80px" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </div>
    </el-dialog>
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

      // 全部分类列表
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
      addCategoryDialogVisible: false,
      addCategoryForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },

      // 父级分类列表
      parentCategoryList: [],

      addCategoryFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分配名称',
            trigger: 'blur',
          },
        ],
      },

      // 级联选择器中选中项
      selectedCategoryKeys: [],
      editCategoryDialogVisible: false,
      editCategoryForm: {},
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表 [API 1.6.1]
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

    // 监听页码条 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },

    // 监听页码条 pagenum 改变的事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCategoryList()
    },

    // 获取所有父级分类（即一层和二层分类） [API 1.6.1]
    async getParentCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCategoryList = res.data
    },

    // 展示添加分类的对话框
    showAddCategoryDialog() {
      this.getParentCategoryList()
      this.addCategoryDialogVisible = true
    },

    // 根据父级分类的变化处理表单中的数据
    parentCategoryChange() {
      console.log(this.selectedCategoryKeys)
      if (this.selectedCategoryKeys.length > 0) {
        this.addCategoryForm.cat_pid = this.selectedCategoryKeys[
          this.selectedCategoryKeys.length - 1
        ]
        this.addCategoryForm.cat_level = this.selectedCategoryKeys.length
      } else {
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },

    // 点击确定按钮，添加分类
    async addCategory() {
      console.log(this.addCategoryForm)
      const { data: res } = await this.$http.post(
        'categories',
        // eslint-disable-next-line comma-dangle
        this.addCategoryForm
      )
      if (res.meta.status !== 201) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getCategoryList()
      this.addCategoryDialogVisible = false
    },

    // 关闭对话框后，重置表单和级联选择器
    addCategoryDialogClose() {
      this.$refs.addCategoryForm.resetFields()
      this.selectedCategoryKeys = []
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
    },

    // 编辑商品分类-查询到的分类信息将展示在编辑分类的对话框中 [API 1.6.3]
    async showEditCategoryDialog(category) {
      const { data: res } = await this.$http.get(
        // eslint-disable-next-line comma-dangle
        `categories/${category.cat_id}`
      )
      if (res.meta.status !== 200) {
        // TODO:
        // QUESTION: 此处不做 return 处理，是否可以高容错？
        // 在此种场景中：仅 1.6.3 API 接口故障，无法查询分类信息。
        // 是否可以在不填充分类名称的情况下，不影响提交操作？
        this.$message.error(res.meta.status)
      } else {
        this.editCategoryForm = res.data
      }
      this.editCategoryDialogVisible = true
    },

    // 编辑分类，点击确定按钮提交
    editCategory() {
      this.$refs.editCategoryFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCategoryForm.cat_id}`,
          {
            cat_name: this.editCategoryForm.cat_name,
            // eslint-disable-next-line comma-dangle
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCategoryList()
        this.editCategoryDialogVisible = false
      })
    },

    // 删除商品分类 [API 1.6.5]
    // TODO: 删除分类后列表数据未刷新。
    // 未能100%复现，可能与网络质量有关。
    removeCategory(category) {
      this.$msgbox
        .confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.$http.delete(`categories/${category.cat_id}`)
          this.getCategoryList()
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}

.tree-table {
  margin-top: 15px;
}
</style>
