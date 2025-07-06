<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SysRoleUser } from '@/interfaces'

const { t } = useI18n()

defineProps<{
  modelValue: boolean
  roleName: string
  users: SysRoleUser[]
  canEdit: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const handleClose = () => {
  emit('update:modelValue', false)
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
        <el-button type="primary">{{ t('sysPerControl.editMembers') }}</el-button>
      </div>
    </div>
  </el-drawer>
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
