<script setup lang="ts">
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import type {ComRole, ComRoleUser} from '@/interfaces'

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
  role: ComRole
  users: ComRoleUser[]
}>()

const emit = defineEmits(['update:modelValue'])

const roleName = computed(() => (locale.value === 'zh-TW' ? props.role.comRoleName : props.role.comRoleEngName))


const handleClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = async () => {
}






import { reactive } from 'vue'

interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const treeProps = reactive({
  checkStrictly: false,
})

const selectable = (row: User) => ![1, 31].includes(row.id)

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

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
    <el-table
        :data="tableData"
        :tree-props="treeProps"
        row-key="id"
        :default-expand-all="true"
    >
      <el-table-column type="selection" width="55" :selectable="selectable" />
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
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
