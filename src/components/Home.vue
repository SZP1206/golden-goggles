<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleBtn" @click="toggleMenu">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符，显示主体内容 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],

      // 根据 id 绑定图标属性
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-claim',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-check',
        145: 'el-icon-s-data',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出功能
    // 清除 token ，通过编程式导航返回登陆页面
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 获取菜单列表 [API 1.4.2]
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      // console.log(this.menuList)
    },

    // 左侧菜单栏的折叠与展开
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },

    // 保持左侧菜单选中高亮效果
    saveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.toggleBtn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu {
  border-right: 0;
}
</style>
