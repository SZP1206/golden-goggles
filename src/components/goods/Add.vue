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

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="categoryList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index1) in item.attr_vals"
                  :key="index1"
                  :label="item1"
                  border
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="80%">
      <img :src="previewPath" class="previewImage" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      // step 和 tab 的联动
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        goods_cat: [
          {
            required: true,
            message: '此项为必选项',
            trigger: 'blur',
          },
        ],
      },
      categoryList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },

      // 动态参数 tab 数据
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        authorization: window.sessionStorage.getItem('token'),
      },
      previewPath: '',
      previewVisible: false,
    }
  },
  computed: {
    categoryId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表 [API 1.6.1]
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.categoryList = res.data
      console.log(this.categoryList)
    },

    // 级联选择器选中项改变
    handleChange() {
      console.log(this.addForm.goods_cat)

      // 只允许选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // 控制面板的切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击切换商品参数面板
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: { sel: 'many' },
            // eslint-disable-next-line comma-dangle
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        // 处理数据，将空格分隔的字符串转为数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: { sel: 'only' },
            // eslint-disable-next-line comma-dangle
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },

    // 预览图片
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },

    // 移除图片
    handleRemove(file) {
      console.log(file)
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },

    // 图片上传成功的钩子函数
    handleSuccess(response) {
      // console.log(response)
      const picInfo = {
        pic: response.data.tmp_path,
      }
      this.addForm.pics.push(picInfo)
    },

    // 添加商品按钮
    addGoods() {
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }

        // 使用 lodash 深拷贝 this.addForm ，防止操作数据后与 cascader 组件冲突
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起 HTTP 请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}

.previewImage {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
