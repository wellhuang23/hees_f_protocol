<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SysRole, SysRoleUser } from '@/interfaces'
import AsignUsers from './AssignUsers.vue'
import { useSysPerRoleStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: SysRole
  canEdit: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const sysPerRoleStore = useSysPerRoleStore()
const { sysRoleUsers } = storeToRefs(sysPerRoleStore)

const dialogVisible = ref(false)

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.sysRoleName : props.role.sysRoleEngName))
const users = computed(() => {
  const roleUsersData = sysRoleUsers.value.find(role => role.sysRoleId === props.role.sysRoleId)
  return roleUsersData ? roleUsersData.sysRoleUsers : []
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
    :title="roleName + ' ' + t('sysPerControl.userList')"
    direction="rtl"
    size="30%"
    @close="handleClose"
  >
    <div class="drawer-container">
      <div class="table-wrapper">
        <el-table :data="users" stripe>
          <el-table-column prop="userNo" :label="t('sysPerControl.userNo')" />
          <el-table-column prop="userStName" :label="t('sysPerControl.userStName')" />
        </el-table>
      </div>
      <div v-if="canEdit" class="footer-button">
        <el-button type="primary" @click="openDialog">{{ t('sysPerControl.editMembers') }}</el-button>
      </div>
    </div>
  </el-drawer>
  <asign-users
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
