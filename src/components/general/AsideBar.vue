<script setup lang="ts">
import { computed } from 'vue'
import { usePersonalSetting } from '@/stores'
import { useI18n } from 'vue-i18n'
import { getAsideBarSysItems } from '@/services/general/AsideBarItems.ts'

const { t } = useI18n()

const personalSetting = usePersonalSetting()
const asideBarItems = computed(() => getAsideBarSysItems())
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
      <el-sub-menu v-for="item in asideBarItems" :index="item.index">
        <template #title>
          <img :src=item.icon alt="asideBarIcon" class="asideBarIcon" style="width: 20px; height: 20px; margin-right: 8px;"/>
          <span v-if="!personalSetting.isAsideCollapsed">{{ t(item.title) }}</span>
        </template>
        <el-menu-item v-for="subItem in item.children" :index="subItem.index">
          {{ t(subItem.title) }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.asides {
  width: 240px;
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

  .asideBarIcon {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
  }
}
</style>