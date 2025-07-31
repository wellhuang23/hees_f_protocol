<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useComPerRoleStore, useUserInfoStore, useValidComStore } from '@/stores'
import type { ComRole } from '@/interfaces'
import {computed, ref} from 'vue'

const { t, locale } = useI18n()

const comPerRoleStore = useComPerRoleStore()
const userInfoStore = useUserInfoStore()
const validComStore = useValidComStore()
const { cusRoles } = storeToRefs(comPerRoleStore)
const { per0100, } = storeToRefs(userInfoStore)

const comTaxNo = validComStore.currentCom.comTaxNo
const perReadRolesUsers = comTaxNo + '-oms-003-0100'
const canViewUsers = computed(() => per0100.value.includes(perReadRolesUsers))

const usersColumnWidth = computed(() => (locale.value === 'en-US' ? 150 : 120))

const getRowKey = (row: ComRole) => {
  return String(row.comRoleId)
}

const selectedRole = ref<ComRole | null>(null)
const drawerVisible = ref(false)
const expandedRowKeys = ref<string[]>([])

// Handle row click to expand/collapse
const handleRowClick = (row: ComRole) => {
  const rowKey = getRowKey(row)
  if (expandedRowKeys.value.includes(rowKey)) {
    // If the clicked row is already expanded, collapse it.
    expandedRowKeys.value = []
  } else {
    // Otherwise, expand the clicked row.
    expandedRowKeys.value = [rowKey]
  }
}

const getRoleName = (row: ComRole) => {
  return locale.value === 'zh-TW' ? row.comRoleName : row.comRoleEngName
}

const permissionTableColumns = computed(() => {
  return [
    {
      prop: 'comPerNo',
      label: t('comPerRoles.cusRoles.perCode'),
      width: '120'
    },
    {
      prop: locale.value === 'zh-TW' ? 'comPerName' : 'comPerEngName',
      label: t('comPerRoles.cusRoles.perName'),
      width: '200'
    },
    {
      prop: locale.value === 'zh-TW' ? 'comPerDesc' : 'comPerEngDesc',
      label: t('comPerRoles.cusRoles.perDesc'),
      width: '300'
    }
  ]
})

const tableColumns = computed(() => {
  return [
    {
      prop: locale.value === 'zh-TW' ? 'comRoleName' : 'comRoleEngName',
      label: t('comPerRoles.cusRoles.roleName'),
      width: locale.value === 'zh-TW' ? '180' : '220'
    },
    {
      prop: locale.value === 'zh-TW' ? 'comRoleDesc' : 'comRoleEngDesc',
      label: t('comPerRoles.cusRoles.roleDesc')
    }
  ]
})

const showUsers = (row: ComRole) => {
  selectedRole.value = row
  drawerVisible.value = true
}
</script>

<template>
<!--  <h3>{{ t('comPerRoles.cusRoles.title') }}</h3>-->
  <el-table
      :data="cusRoles"
      stripe
      style="width: 100%"
      :row-key="getRowKey"
      :expand-row-keys="expandedRowKeys"
      @row-click="handleRowClick"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div class="permission-details">
          <h4>{{ getRoleName(props.row) }} {{ t('comPerRoles.cusRoles.permissionHint') }}</h4>
          <el-table :data="props.row.comPermissions" border>
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
        <span :class="{ 'role-name-clickable': column.prop === 'comRoleName' || column.prop === 'comRoleEngName' }">
          {{ scope.row[column.prop] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="canViewUsers" :label="t('comPerRoles.defRoles.users')" :width="usersColumnWidth">
      <template #default="scope">
        <el-button @click.stop="showUsers(scope.row)" type="primary" link>
          {{ t('comPerRoles.cusRoles.viewUsers') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.permission-details {
  padding: 10px 20px 10px 48px; // Indent to align with table content
  background-color: #f5f7fa;
  h4 {
    margin-bottom: 10px;
  }
}
</style>