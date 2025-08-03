<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ComRole, ComRoleUser, RolePerUser } from '@/interfaces'
import { useComPerRoleStore } from '@/stores'
import {ElNotification, type ElTable} from 'element-plus'
import {
  assignUsersComPerRole,
  getComRoles,
  getComRoleUsers,
  getGroupUsers,
} from '@/services'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: ComRole
  users: ComRoleUser[]
}>()

const comPerRoleStore = useComPerRoleStore()

const emit = defineEmits(['update:modelValue'])

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.comRoleName : props.role.comRoleEngName))

const treeProps = reactive({
  checkStrictly: false,
})

const strUnitName = (row: RolePerUser) => {
  if (row.strUnitName != '') {
    const name = locale.value === 'zh-TW' ? row.strUnitName : row.strUnitEngName
    return name + '(' + row.strUnitNo + ')'
  } else {
    return ''
  }
}

const selectedUserIds = ref<(number | undefined)[]>([])

watchEffect(() => {
  selectedUserIds.value = props.users.map(u => u.userId)
})

const isSelected = (user: ComRoleUser) => {
  return selectedUserIds.value.includes(user.userId)
}

const toggleSelection = (user: ComRoleUser) => {
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
  const errno = await assignUsersComPerRole({
    comRoleId: props.role.comRoleId ?? 0,
    userIds: selectedUserIds.value.filter((id): id is number => id !== undefined)
  })
  if (errno === '00000') {
    handleClose()
    await getComRoles()
    await getComRoleUsers()
    await getGroupUsers()

    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComPerRoleUsersSuccessMsg'),
      type: 'success'
    })
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComPerRoleUsersFailMsg'),
      type: 'error'
    })
  }
}
</script>

<template>
  <el-dialog
      :model-value="modelValue"
      :title="t('comPerRoles.defRoles.editMembers')"
      width="800px"
      center
      @close="handleClose"
  >
    <div class="role-name">
      <strong>{{ t('comPerRoles.defRoles.roleName') }}:</strong> {{ roleName }}
    </div>
    <div v-for="comUsers in comPerRoleStore.groupUsers" :key="comUsers.comId">
      <h4>{{ comUsers.comStName }}({{ comUsers.comTaxNo }})</h4>
      <el-table
          :data="comUsers.users"
          :tree-props="treeProps"
          row-key="rowKey"
          :default-expand-all="true"
      >
        <el-table-column
            :label="t('comPerRoles.defRoles.assignMembers.colStrUnitName')"
            width="300px"
        >
          <template #default="props">
            {{ strUnitName(props.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="userStName" :label="t('comPerRoles.defRoles.assignMembers.colUserStName')" />
        <el-table-column prop="userNo" :label="t('comPerRoles.defRoles.assignMembers.colUserNo')" />
        <el-table-column :label="t('comPerRoles.defRoles.assignMembers.status')">
          <template #default="scope">
            <el-button
                v-if="scope.row.userId !== 0"
                :type="isSelected(scope.row) ? 'success' : 'info'"
                plain
                @click="toggleSelection(scope.row)"
            >
              {{ isSelected(scope.row)
                ? t('comPerRoles.defRoles.assignMembers.selected')
                : t('comPerRoles.defRoles.assignMembers.notSelected') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
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
