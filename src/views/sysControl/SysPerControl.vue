<script setup lang="ts">
import Roles from '@/components/sysControl/Roles.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { getSysRole, getSysRoleUsers } from '@/services'
import { useSysPerRoleStore } from '@/stores'

const sysPerRoleStore = useSysPerRoleStore()
const { sysRoles } = storeToRefs( sysPerRoleStore )
const { sysRoleUsers } = storeToRefs( sysPerRoleStore )

onMounted(async () => {
  if (sysRoles.value.length === 0) {
    await getSysRole()
  }
  if (sysRoleUsers.value.length === 0) {
    await getSysRoleUsers();
  }
})
</script>

<template>
  <div class="sys_per_control">
    <roles />
  </div>
</template>

<style scoped lang="scss">

</style>

