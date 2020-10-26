<template>
  <dir>
    <el-button type="info" @click="logout">退出</el-button>
  </dir>
</template>

<script>
export default {
  methods: {
    // 退出功能
    // 清除 token ，通过编程式导航返回登陆页面
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped></style>
