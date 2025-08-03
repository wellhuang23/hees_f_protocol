<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ComRole } from '@/interfaces'
import { useComPerRoleStore } from '@/stores'
import { storeToRefs } from 'pinia'
import PerRolesDefAssignUsers from '@/components/oms/PerRolesDefAssignUsers.vue'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: ComRole
  canEdit: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const comPerRoleStore = useComPerRoleStore()
const { comRoleUsers } = storeToRefs(comPerRoleStore)

const dialogVisible = ref(false)

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.comRoleName : props.role.comRoleEngName))
const users = computed(() => {
  const roleUsersData = comRoleUsers.value.find(role => role.comRoleId === props.role.comRoleId)
  return roleUsersData ? roleUsersData.comRoleUsers : []
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const openDialog = () => {
  dialogVisible.value = true
}
</script>

<template>
  <el-drawer
      :model-value="modelValue"
      :title="roleName + ' ' + t('comPerRoles.defRoles.userList')"
      direction="rtl"
      size="30%"
      @close="handleClose"
  >
    <div class="drawer-container">
      <div class="table-wrapper">
        <el-table :data="users" stripe>
          <el-table-column prop="userNo" :label="t('comPerRoles.defRoles.userNo')" />
          <el-table-column prop="userStName" :label="t('comPerRoles.defRoles.userStName')" />
        </el-table>
      </div>
      <div v-if="canEdit" class="footer-button">
        <el-button type="primary" @click="openDialog">{{ t('comPerRoles.defRoles.editMembers') }}</el-button>
      </div>
    </div>
  </el-drawer>
  <per-roles-def-assign-users
      v-model="dialogVisible"
      :role="role"
      :users="users"
  />
</template>

<style scoped lang="scss">
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.footer-button {
  flex-shrink: 0;
  text-align: center;
  padding-bottom: 10px; // To make it closer to 30px from the bottom including button height
}
</style>
