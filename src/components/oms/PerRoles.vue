<script setup lang="ts">
import PerRolesDef from '@/components/oms/PerRolesDef.vue'
import PerRolesCus from '@/components/oms/PerRolesCus.vue'
import {onMounted, ref} from 'vue'
import { getComRoles, getComRoleUsers, getGroupUsers } from '@/services'
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const activeLabel = 'defRoles'
const activeName = ref(activeLabel)

onMounted(async () => {
  await getComRoles()
  await getComRoleUsers()
  await getGroupUsers()
})
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane :label="t('comPerRoles.defRoles.title')" name="defRoles">
      <per-roles-def />
    </el-tab-pane>
    <el-tab-pane :label="t('comPerRoles.cusRoles.title')" name="cusRoles">
      <per-roles-cus />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">

</style>