<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue'
import {useI18n} from 'vue-i18n'
import {useSysPerRoleStore} from '@/stores'
import {storeToRefs} from 'pinia'
import type {SysRole, SysRoleUser} from '@/interfaces'
import {assignUsersSysPerRole} from '@/services'
import {
  getSysRole,
  getSysRoleUsers,
  getSysUsers,
} from '@/services'
import { ElNotification } from 'element-plus'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: SysRole
  users: SysRoleUser[]
}>()

const emit = defineEmits(['update:modelValue'])

const sysPerRoleStore = useSysPerRoleStore()
const { sysRoleUsers } = storeToRefs(sysPerRoleStore)

const allUsers = computed(() => {
  const all = sysRoleUsers.value.flatMap(role => role.sysRoleUsers)
  return all.reduce((acc, user) => {
    if (user.userId !== undefined && !acc.some(u => u.userId === user.userId)) {
      acc.push(user)
    }
    return acc
  }, [] as SysRoleUser[])
})

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.sysRoleName : props.role.sysRoleEngName))

const selectedUserIds = ref<(number | undefined)[]>([])

watchEffect(() => {
  selectedUserIds.value = props.users.map(u => u.userId)
})

const isSelected = (user: SysRoleUser) => {
  return selectedUserIds.value.includes(user.userId)
}

const toggleSelection = (user: SysRoleUser) => {
  const index = selectedUserIds.value.indexOf(user.userId)
  if (index > -1) {
    selectedUserIds.value.splice(index, 1)
  } else {
    selectedUserIds.value.push(user.userId)
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = async () => {
  if (typeof props.role.sysRoleId === 'number') {
    const errno = await assignUsersSysPerRole({
      sysRoleId: props.role.sysRoleId,
      userIds: selectedUserIds.value.filter((id): id is number => id !== undefined)
    })
    handleClose()

    if (errno === '00000') {
      await getSysRole()
      await getSysRoleUsers()
      await getSysUsers()

      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateSysPerRoleUsersSuccessMsg'),
        type: 'success'
      })
      location.reload()

    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateSysPerRoleUsersFailMsg'),
        type: 'error'
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="t('sysPerControl.editMembers')"
    width="500"
    center
    @close="handleClose"
  >
    <div class="role-name">
      <strong>{{ t('sysPerControl.roleName') }}:</strong> {{ roleName }}
    </div>
    <el-table :data="allUsers" height="300px">
      <el-table-column prop="userStName" :label="t('sysPerControl.userStName')" />
      <el-table-column :label="t('sysPerControl.status')">
        <template #default="scope">
          <el-button
            :type="isSelected(scope.row) ? 'success' : 'info'"
            plain
            @click="toggleSelection(scope.row)"
          >
            {{ isSelected(scope.row) ? t('sysPerControl.selected') : t('sysPerControl.notSelected') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ t('general.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.role-name {
  margin-bottom: 20px;
  font-size: 16px;
}
.dialog-footer {
  text-align: center;
}
</style>
