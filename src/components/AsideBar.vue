<script setup lang="ts">

</script>

<template>
  <div class="asides">
    <h2>
      <!--        <img src="@/assets/hees_logo_white_nb.png" alt="Logo" class="hees-logo">-->
      <router-link to="/main/dashboard" class="white-link">
        HEEs
      </router-link>
    </h2>
    <el-menu
        router
        active-text-color="#ffd04b"
        background-color="#142334"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系統管理</span>
        </template>
        <el-menu-item index="/main/sys/perControl">系統權限</el-menu-item>
        <el-menu-item index="/main/sys/logs">系統日誌</el-menu-item>
        <el-menu-item index="/main/sys/subs">訂閱管理</el-menu-item>
        <el-menu-item index="/main/sys/cusServices">客戶服務</el-menu-item>
        <el-menu-item index="/main/sys/updateCal">日曆更新</el-menu-item>
        <el-menu-item index="/main/sys/notifications">系統公告</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.asides {
  width: 200px;
  background-color: #142334;
  color: white;

  .el-menu {
    border-right: none;
  }

  //.hees-logo {
  //  height: 1em;
  //  vertical-align: middle;
  //  margin-right: 5px;
  //}

  h2 {
    font-size: 30px;
    text-align: center;
    height: 70px;
    line-height: 70px;
    color: white;

    .white-link {
      color: white;
      text-decoration: none;
    }
  }
}
</style>