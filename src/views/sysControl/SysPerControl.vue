<script setup lang="ts">
import Roles from '@/components/sysControl/PerRoles.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  getSysRole,
  getSysRoleUsers,
  getSysUsers,
} from '@/services'
import { useSysPerRoleStore } from '@/stores'
import RotateIcon from '@/assets/icons/solid/rotate.svg'

const sysPerRoleStore = useSysPerRoleStore()
const { sysRoles } = storeToRefs( sysPerRoleStore )
const { sysRoleUsers } = storeToRefs( sysPerRoleStore )
const { sysUsers } = storeToRefs( sysPerRoleStore )

onMounted(async () => {
  if (sysRoles.value.length === 0) {
    await getSysRole()
  }
  if (sysRoleUsers.value.length === 0) {
    await getSysRoleUsers();
  }

  if (sysUsers.value.length === 0) {
    await getSysUsers();
  }
})

const handleRefresh = async () => {
  await getSysRole()
  await getSysRoleUsers()
  await getSysUsers()
}
</script>

<template>
  <div class="sys_per_control">
    <div class="refresh-button-container">
      <el-button class="refresh-button" @click="handleRefresh">
        <img :src="RotateIcon" alt="Refresh" style="width: 1em; height: 1em;" />
      </el-button>
    </div>
    <roles />
  </div>
</template>

<style scoped lang="scss">
.refresh-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px; /* Add some space below the button */
}
</style>

