<script setup lang="ts">
import PerRolesDef from '@/components/oms/PerRolesDef.vue'
import PerRolesCus from '@/components/oms/PerRolesCus.vue'
import { onMounted } from 'vue'
import { getComRoles } from '@/services'

onMounted(async () => {
  await getComRoles()
})
</script>

<template>
  <div class="def-roles-container">
    <per-roles-def />
  </div>
  <div class="cus-roles-container">
    <per-roles-cus />
  </div>
</template>

<style scoped lang="scss">
.def-roles-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Do not shrink */
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.cus-roles-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Do not shrink */
  width: 100%;
  height: 50%;
  box-sizing: border-box;
}
</style>