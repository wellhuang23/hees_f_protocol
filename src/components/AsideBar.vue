<script setup lang="ts">
import { usePersonalSetting } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const personalSetting = usePersonalSetting()
</script>

<template>
  <div class="asides" :class="{ 'collapsed': personalSetting.isAsideCollapsed }">
    <h2>
      <router-link to="/main/dashboard" class="white-link">
        <span v-if="!personalSetting.isAsideCollapsed">HEEs</span>
        <img v-else src="/src/assets/logos/hees_logo_white_nb.png" alt="Logo" class="hees-logo-collapsed" />
      </router-link>
    </h2>
    <el-menu
        router
        :collapse="personalSetting.isAsideCollapsed"
        active-text-color="#ffd04b"
        background-color="#142334"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
    >
      <el-sub-menu index="1">
        <template #title>
          <img src="/src/assets/icons/solid/gear.svg" alt="system" class="system" style="width: 20px; height: 20px; margin-right: 8px;"/>
          <span v-if="!personalSetting.isAsideCollapsed">{{ t('asideBarCategory.sysManage') }}</span>
        </template>
        <el-menu-item index="/main/sys/perControl">{{ t('pageTitle.sysPermissions') }}</el-menu-item>
        <el-menu-item index="/main/sys/logs">{{ t('pageTitle.sysLogs') }}</el-menu-item>
        <el-menu-item index="/main/sys/subs">{{ t('pageTitle.subManage') }}</el-menu-item>
        <el-menu-item index="/main/sys/cusServices">{{ t('pageTitle.cusServices') }}</el-menu-item>
        <el-menu-item index="/main/sys/updateCal">{{ t('pageTitle.calendarUpdate') }}</el-menu-item>
        <el-menu-item index="/main/sys/notifications">{{ t('pageTitle.sysNotification') }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.asides {
  width: 200px;
  background-color: #142334;
  color: white;
  transition: width 0.3s;

  &.collapsed {
    width: 64px;
  }

  .el-menu {
    border-right: none;
  }

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

    .hees-logo-collapsed {
      width: 40px;
      vertical-align: middle;
    }
  }

  .system {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
  }
}
</style>