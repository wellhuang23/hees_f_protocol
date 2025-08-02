<script setup lang="ts">
import {computed, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import type {ComRole, ComRoleUser, RolePerUser} from '@/interfaces'
import {useComPerRoleStore} from '@/stores'
import type { ElTable } from 'element-plus'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: ComRole
  users: ComRoleUser[]
}>()

const comPerRoleStore = useComPerRoleStore()

const emit = defineEmits(['update:modelValue'])

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.comRoleName : props.role.comRoleEngName))

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = async () => {
}

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
</script>

<template>
  <el-dialog
      :model-value="modelValue"
      :title="t('comPerRoles.defRoles.editMembers')"
      width="800"
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
        <el-table-column :label="t('comPerRoles.defRoles.assignMembers.colStrUnitName')" >
          <template #default="props">
            {{ strUnitName(props.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="userStName" :label="t('comPerRoles.defRoles.assignMembers.colUserStName')" />
        <el-table-column prop="userNo" :label="t('comPerRoles.defRoles.assignMembers.colUserNo')" />
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
