<script setup lang="ts">
import Roles from '@/components/sysControl/Roles.vue'
import {ref} from 'vue'

const activeTab = ref('roles')
</script>

<template>
  <div class="sys_per_control">
    <el-tabs v-model="activeTab">
      <roles />
      <el-tab-pane label="角色成員" name="members">
        <p>角色成員內容</p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">

</style>

