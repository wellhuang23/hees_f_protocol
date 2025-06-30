<script setup lang="ts">
import AsideBar from '@/components/AsideBar.vue'
import TopBar from '@/components/TopBar.vue'
</script>

<template>
  <div class="main">
    <aside-bar />
    <div class="main-content">
      <top-bar />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;

  display: flex;

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
    }
  }
}
</style>
