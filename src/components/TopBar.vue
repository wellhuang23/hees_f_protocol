<script setup lang="ts">
import {
  logOutAction,
  syncUser
} from '@/services'
import { ElNotification } from 'element-plus'
import {useRouter} from 'vue-router'
import { useUserInfoStore } from '@/stores'
import { changeLanguage } from '@/services/general/changeLang'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userInfoStore = useUserInfoStore()

const router = useRouter()

const handleSelect = (index: string) => {
  if (index === '1_1') {
    changeLanguage('zh-TW')
  } else if (index === '1_2') {
    changeLanguage('en-US')
  }
}

const onLogOut = async () => { // Changed to async as validate returns a Promise
  const errno: string = await logOutAction()
  if (errno === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.logOutSuccessMsg'),
      type: 'success'
    })
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.logOutErrorMsg'),
      type: 'error'
    })
  }
  await router.push('/logIn')
}

const onSyncUser = async () => { // Changed to async as validate returns a Promise
  const errno: string = await syncUser()
  if (errno === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updatePerSuccessMsg'),
      type: 'success'
    })
  } else if (errno === '02005') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.subExpireMsg'),
      type: 'error'
    })
    await router.push('/logIn')
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updatePerErrorMsg'),
      type: 'error'
    })
    await router.push('/logIn')
  }
}
</script>

<template>
  <div class="top">
    <el-menu
        :ellipsis="false"
        mode="horizontal"
        background-color="#142334"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
      <el-sub-menu index="1" class="hide-arrow">
        <template #title>
          <img src="/src/assets/icons/solid/globe.svg" alt="Language" class="globe" style="width: 20px; height: 20px;"/>
        </template>
        <el-menu-item index="1_1">繁體中文</el-menu-item>
        <el-menu-item index="1_2">English</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <img src="/src/assets/icons/solid/user-large.svg" alt="user" class="user" style="width: 20px; height: 20px; margin-right: 8px;"/>
          <span>{{ userInfoStore.userStName }}</span>
        </template>
        <el-menu-item index="2_1">{{ t('topBar.profile') }}</el-menu-item>
        <el-menu-item index="2_2" @click="onSyncUser">{{ t('topBar.syncPermission') }}</el-menu-item>
        <el-menu-item index="2_3" @click="onLogOut">{{ t('topBar.logOut') }}</el-menu-item>
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

    .globe {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
    }

    .user {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
    }

    .hide-arrow .el-sub-menu__icon-arrow {
      display: none;
    }

    .el-sub-menu.is-active .el-sub-menu__title {
      border-bottom-color: transparent !important;
    }
  }
}
</style>