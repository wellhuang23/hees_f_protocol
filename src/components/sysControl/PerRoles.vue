<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSysPerRoleStore, useUserInfoStore } from '@/stores'
import type { SysRole } from '@/interfaces'
import { useI18n } from 'vue-i18n'
import RoleUsers from './PerRoleUsers.vue'

const { t, locale } = useI18n()

const sysPerRoleStore = useSysPerRoleStore()
const { sysRoles } = storeToRefs(sysPerRoleStore)
const userInfoStore = useUserInfoStore()
const { per0100, per0010 } = storeToRefs(userInfoStore)

const canViewUsers = computed(() => per0100.value.includes('sys-002-0100'))
const canEditUsers = computed(() => per0010.value.includes('sys-002-0010'))
const usersColumnWidth = computed(() => (locale.value === 'en-US' ? 150 : 120))

const expandedRowKeys = ref<string[]>([])
const drawerVisible = ref(false)
const selectedRole = ref<SysRole | null>(null)

// Get unique key for each row
const getRowKey = (row: SysRole) => {
  return String(row.sysRoleId)
}

// Handle row click to expand/collapse
const handleRowClick = (row: SysRole) => {
  const rowKey = getRowKey(row)
  if (expandedRowKeys.value.includes(rowKey)) {
    // If the clicked row is already expanded, collapse it.
    expandedRowKeys.value = []
  } else {
    // Otherwise, expand the clicked row.
    expandedRowKeys.value = [rowKey]
  }
}

const showUsers = (row: SysRole) => {
  selectedRole.value = row
  drawerVisible.value = true
}

const tableColumns = computed(() => {
  return [
    {
      prop: locale.value === 'zh-TW' ? 'sysRoleName' : 'sysRoleEngName',
      label: t('sysPerControl.roleName'),
      width: locale.value === 'zh-TW' ? '180' : '220'
    },
    {
      prop: locale.value === 'zh-TW' ? 'sysRoleDesc' : 'sysRoleEngDesc',
      label: t('sysPerControl.roleDesc')
    }
  ]
})

const permissionTableColumns = computed(() => {
  return [
    {
      prop: 'sysPerNo',
      label: t('sysPerControl.perCode'),
      width: '120'
    },
    {
      prop: locale.value === 'zh-TW' ? 'sysPerName' : 'sysPerEngName',
      label: t('sysPerControl.perName'),
      width: '200'
    },
    {
      prop: locale.value === 'zh-TW' ? 'sysPerDesc' : 'sysPerEngDesc',
      label: t('sysPerControl.perDesc'),
      width: '300'
    }
  ]
})

const getRoleName = (row: any) => {
  return locale.value === 'zh-TW' ? row.sysRoleName : row.sysRoleEngName
}
</script>

<template>
  <el-table
      :data="sysRoles"
      stripe
      style="width: 100%"
      :row-key="getRowKey"
      :expand-row-keys="expandedRowKeys"
      @row-click="handleRowClick"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div class="permission-details">
          <h4>{{ getRoleName(props.row) }} {{ t('sysPerControl.permissionHint') }}</h4>
          <el-table :data="props.row.sysPermissions" border>
            <el-table-column
                v-for="column in permissionTableColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
            />
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column
        v-for="column in tableColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
    >
      <template #default="scope">
        <span :class="{ 'role-name-clickable': column.prop === 'sysRoleName' || column.prop === 'sysRoleEngName' }">
          {{ scope.row[column.prop] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="canViewUsers" :label="t('sysPerControl.users')" :width="usersColumnWidth">
      <template #default="scope">
        <el-button @click.stop="showUsers(scope.row)" type="primary" link>
          {{ t('sysPerControl.viewUsers') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <role-users
    v-if="selectedRole"
    v-model="drawerVisible"
    :role="selectedRole"
    :can-edit="canEditUsers"
  />
</template>

<style scoped lang="scss">
.sys_per_control {
  padding: 20px;
}
.role-name-clickable {
  cursor: pointer;
  color: #409eff;
  &:hover {
    text-decoration: underline;
  }
}
.permission-details {
  padding: 10px 20px 10px 48px; // Indent to align with table content
  background-color: #f5f7fa;
  h4 {
    margin-bottom: 10px;
  }
}
</style>
