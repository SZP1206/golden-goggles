<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" />
      </div>
      <!-- 登陆表单 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-s-claim"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          {
            required: 'true',
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 ~ 10 之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: 'true',
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 10,
            message: '密码长度在 6 ~ 10 之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击“重置”按钮，重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败！')
        }
        this.$message.success('登陆成功！')

        // 将 Token 保存到 sessionStorage
        window.sessionStorage.setItem('token', res.data.token)

        // 编程式导航跳转到 /home
        // TODO: 复习 Vue Router
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
