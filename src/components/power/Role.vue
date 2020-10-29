<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图，展示页面主体 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @close="addRoleClose"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        label-width="90px"
        ref="addRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="editRoleDialogClose"
    >
      <!-- 编辑与添加共用表单校验规则 -->
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        label-width="90px"
        ref="editRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addRoleVisible: false,
      addRoleForm: {
        roleName: 'TEST',
        roleDesc: 'THIS IS A TEST',
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '角色名称不能为空！', trigger: 'blur' },
        ],
      },
      editRoleVisible: false,
      editRoleForm: {},
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表 [API 1.5.1]
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleList = res.data
      console.log(this.roleList)
    },

    // 关闭添加角色的对话框后，重置表单
    addRoleClose() {
      this.$refs.addRoleRef.resetFields()
    },

    // 添加角色 [API 1.5.2]
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addRoleVisible = false
        this.getRoleList()
      })
    },

    // 展示编辑角色的对话框 [API 1.5.3]
    // 根据API接口查询到的角色信息，填充到 form 表单
    async editDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.editRoleForm = res.data
      this.editRoleVisible = true
    },

    // 关闭修改角色的对话框后，重置表单
    editRoleDialogClose() {
      this.$refs.editRoleRef.resetFields()
    },

    // 提交编辑后的角色 [API 1.5.4]
    // code == 200 时，服务器返回的 res.meta.msg 有误，因此使用自定义消息。
    editRole() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
            // eslint-disable-next-line comma-dangle
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('角色修改成功！')
        this.getRoleList()
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
