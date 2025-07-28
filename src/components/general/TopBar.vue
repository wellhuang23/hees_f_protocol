<script setup lang="ts">
import {
  logOutAction,
  syncUser
} from '@/services'
import { ElNotification } from 'element-plus'
import {useRouter} from 'vue-router'
import {
  useUserInfoStore,
  usePersonalSetting,
  useValidComStore
} from '@/stores'
import { changeLanguage } from '@/services/general/changeLang.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userInfoStore = useUserInfoStore()
const personalSetting = usePersonalSetting()
const validComStore = useValidComStore()

const router = useRouter()

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

const changeCompany = async (comTaxNo: string) => {
  validComStore.changeCom(comTaxNo)
  location.reload()
}

const onToggleAside = () => {
  personalSetting.toggleAside()
}
</script>

<template>
  <div class="top">
    <div class="left-menu">
      <img src="/src/assets/icons/solid/bars.svg" alt="menu" class="menu-icon" @click="onToggleAside"/>
    </div>
    <el-menu
        :ellipsis="false"
        mode="horizontal"
        background-color="#142334"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-sub-menu index="1" class="hide-arrow">
        <template #title>
          <img src="/src/assets/icons/solid/building.svg" alt="Language" class="company" style="width: 20px; height: 20px;"/>
          <span>{{ validComStore.currentCom.comStName }}</span>
        </template>
        <el-menu-item
            v-for="validCom in validComStore.validCompanies"
            :index="validCom.comTaxNo"
            @click="changeCompany(validCom.comTaxNo)"
        >
          {{ validCom.comTaxNo}}-{{ validCom.comStName }}
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2" class="hide-arrow">
        <template #title>
          <img src="/src/assets/icons/solid/globe.svg" alt="Language" class="globe" style="width: 20px; height: 20px;"/>
        </template>
        <el-menu-item index="2_1" @click="changeLanguage('zh-TW')">繁體中文</el-menu-item>
        <el-menu-item index="2_2" @click="changeLanguage('en-US')">English</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <img src="/src/assets/icons/solid/user-large.svg" alt="user" class="user" style="width: 20px; height: 20px; margin-right: 8px;"/>
          <span>{{ userInfoStore.userStName }}</span>
        </template>
        <el-menu-item index="3_1">
          <router-link to="/main/profile" class="white-link">
            {{ t('topBar.profile') }}
          </router-link>
        </el-menu-item>
        <el-menu-item index="3_2" @click="onSyncUser">{{ t('topBar.syncPermission') }}</el-menu-item>
        <el-menu-item index="3_3" @click="onLogOut">{{ t('topBar.logOut') }}</el-menu-item>
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
  justify-content: space-between;
  align-items: center;

  .left-menu {
    padding-left: 20px;
    .menu-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
    }
  }

  .el-menu {
    border-bottom: none;

    .company {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
      margin-right: 10px;
    }

    .globe {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
    }

    .user {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
    }
  }
}
.white-link {
  color: white;
  text-decoration: none;
}
</style>