<script setup lang="ts">
import { logOutAction } from '@/services'
import { ElNotification } from 'element-plus'
import {useRouter} from 'vue-router'

const router = useRouter()

const onLogOut = async () => { // Changed to async as validate returns a Promise
  const errno: string = await logOutAction()
  if (errno === '00000') {
    ElNotification({
      title: '通知',
      message: '登出成功',
      type: 'success'
    })
  } else {
    ElNotification({
      title: '通知',
      message: '登出操作有誤，已清空本地資料，請洽系統管理員',
      type: 'error'
    })
  }
  await router.push('/logIn')
}
</script>

<template>
  <div class="top">
    <el-menu
        router
        :ellipsis="false"
        mode="horizontal"
        background-color="#142334"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><User /></el-icon>
          <span>使用者</span>
        </template>
        <el-menu-item index="1_1">個人資訊</el-menu-item>
        <el-menu-item index="1_2" @click="onLogOut">登出</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.top {
  height: 60px;
  background-color: #142334;
  color: white;

  display: flex;
  justify-content: flex-end;

  .el-menu {
    border-bottom: none;
  }
}
</style>