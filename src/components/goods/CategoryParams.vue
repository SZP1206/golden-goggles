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
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加参数</el-button
          >

          <!-- 展示动态参数的表格 -->
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
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加属性</el-button
          >

          <!-- 展示静态属性的表格 -->
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

    <!-- 添加动态参数或静态属性的对话框
    通过 computed 计算对话框中不同的文字 -->
    <el-dialog
      :title="'添加' + dialogText"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item
          :label="dialogText + '名称'"
          label-width="120px"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改动态参数或静态属性的对话框 -->
    <el-dialog
      :title="'修改' + dialogText"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item
          :label="dialogText + '名称'"
          label-width="120px"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
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
      addDialogVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
      },
      editForm: {},
      editDialogVisible: false,
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
    dialogText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
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

    // 展示编辑动态参数或静态属性的对话框 [API 1.7.4]
    async showEditParamsDialog(params) {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes/${params.attr_id}`,
        // eslint-disable-next-line comma-dangle
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    // 关闭修改的对话框后，重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    // 点击确定按钮，提交修改后的动态参数或静态属性 [API 1.7.5]
    editParams(params) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${this.editForm.attr_id}`,
          // eslint-disable-next-line comma-dangle
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsList()
        this.editDialogVisible = false
      })
    },

    // 展示添加动态参数或静态属性的对话框
    showAddDialog() {
      this.addDialogVisible = true
    },

    // 关闭添加的对话框后，重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },

    // 点击 确定 按钮，添加动态参数或静态属性 [API 1.7.2]
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
            // eslint-disable-next-line comma-dangle
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsList()
        this.addDialogVisible = false
      })
    },

    // 删除动态参数或静态属性
    deleteParams(params) {
      this.$msgbox
        .confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          const { data: res } = await this.$http.delete(
            // eslint-disable-next-line comma-dangle
            `categories/${this.categoryId}/attributes/${params.attr_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getParamsList()
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 15px 0;
}
</style>
