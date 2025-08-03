<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import SubAddNewGroup from './SubAddNewGroup.vue'
import SubAddNewCom from './SubAddNewCom.vue'
import SubChangeGroupAdminPwdConfirm from './SubChangeAdminPwdConfirm.vue'
import { useSubItemsStore } from '@/stores/oms/orgs'
import { getAllGroupSubs, changeGroupAdminPwd } from '@/services/oms/orgs'
import { getAllSubItems } from '@/services/oms/orgs'
import type { GroupCompanies, ComSubs } from '@/interfaces'
import { useUserInfoStore } from '@/stores/oms/auths'
import {ElNotification} from "element-plus";

const { t, locale } = useI18n()

const subItemsStore = useSubItemsStore()
const { subItems } = storeToRefs(subItemsStore)
const { groupSubs } = storeToRefs(subItemsStore)

const userInfoStore = useUserInfoStore()
const { per1000, per0010 } = storeToRefs(userInfoStore)

const showAddGroupDialog = ref(false)
const showAddComDialog = ref(false)
const showChangePwdDialog = ref(false)
const adminPwd = ref('')
const selectedGroup = ref<GroupCompanies | null>(null)

const loading = ref(false)
const expandedGroupRowKeys = ref<string[]>([])
const expandedComRowKeys = ref<string[]>([])

const canCreateSubscription = computed(() => {
  return per1000.value.includes('sys-005-1000')
})

const canChangePassword = computed(() => {
  return per0010.value.includes('sys-005-0010')
})

const showActionsColumn = computed(() => {
  return canCreateSubscription.value || canChangePassword.value
})

// --- Get Row Keys ---
const getGroupRowKey = (row: GroupCompanies) => `group-${row.groupId}`
const getComRowKey = (row: ComSubs) => `com-${row.comId}`

// --- Handle Row Clicks for Expansion ---
const handleGroupRowClick = (row: GroupCompanies) => {
  const rowKey = getGroupRowKey(row)
  if (expandedGroupRowKeys.value.includes(rowKey)) {
    expandedGroupRowKeys.value = []
  } else {
    expandedGroupRowKeys.value = [rowKey]
    expandedComRowKeys.value = [] // Collapse company rows when a new group is expanded
  }
}

const handleComRowClick = (row: ComSubs) => {
  const rowKey = getComRowKey(row)
  const index = expandedComRowKeys.value.indexOf(rowKey)
  if (index > -1) {
    expandedComRowKeys.value.splice(index, 1)
  } else {
    expandedComRowKeys.value.push(rowKey)
  }
}

const openAddCompanyDialog = (group: GroupCompanies) => {
  selectedGroup.value = group
  showAddComDialog.value = true
}

const handleChangePassword = async (row: ComSubs) => {
  const res = await changeGroupAdminPwd({ comId: row.comId })
  if (res.errno === '00000') {
    adminPwd.value = res.adminNewPwd ?? ''
    showChangePwdDialog.value = true

    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateGroupAdminPwdSuccessMsg'),
      type: 'success'
    })
  } else {
    if (res.errno === '01001') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateGroupAdminNoUserErrorMsg'),
        type: 'error'
      })
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateGroupAdminErrorMsg'),
        type: 'error'
      })
    }
  }
}

// --- Table Columns ---
const groupTableColumns = computed(() => [
  {
    prop: 'groupName',
    label: t('subList.groupName'),
  },
])

const comTableColumns = computed(() => [
  {
    prop: 'comTaxNo',
    label: t('subList.comTaxNo'),
    width: '150',
  },
  {
    prop: 'comName', // This will be a custom column
    label: t('subList.comName'),
  },
])

const subTableColumns = computed(() => [
  {
    prop: 'subNo',
    label: t('subList.subNo'),
    width: '200',
  },
  {
    prop: 'subName', // Custom column
    label: t('subList.subName'),
  },
  {
    prop: 'subStartDate',
    label: t('subList.subStartDate'),
    width: '180',
  },
  {
    prop: 'subEndDate',
    label: t('subList.subEndDate'),
    width: '180',
  },
])

// --- Data Loading ---
const loadGroupData = async () => {
  if (groupSubs.value.length > 0) return
  loading.value = true
  await getAllGroupSubs()
  loading.value = false
}

const loadSubItemsData = async () => {
  if (subItems.value.length > 0) return
  loading.value = true
  await getAllSubItems()
  loading.value = false
}

onMounted(() => {
  loadGroupData()
  loadSubItemsData()
})
</script>

<template>
  <div class="sub-list-container">
    <div class="header-container">
      <el-button v-if="canCreateSubscription" type="success" class="add-button" @click="showAddGroupDialog = true">{{ t('subList.add') }}</el-button>
    </div>
    <SubAddNewGroup v-if="showAddGroupDialog" v-model="showAddGroupDialog" />
    <SubAddNewCom v-if="showAddComDialog" v-model="showAddComDialog" :group="selectedGroup" />
    <SubChangeGroupAdminPwdConfirm v-if="showChangePwdDialog" v-model="showChangePwdDialog" :adminPwd="adminPwd" />
  <el-table
    :data="groupSubs"
    stripe
    style="width: 100%"
    v-loading="loading"
    :row-key="getGroupRowKey"
    :expand-row-keys="expandedGroupRowKeys"
    @row-click="handleGroupRowClick"
  >
    <el-table-column type="expand">
      <template #default="groupProps">
        <div class="details-wrapper">
          <el-table
            :data="groupProps.row.comSubs"
            border
            :row-key="getComRowKey"
            :expand-row-keys="expandedComRowKeys"
            @row-click="handleComRowClick"
          >
            <el-table-column type="expand">
              <template #default="comProps">
                <div class="details-wrapper">
                  <el-table :data="comProps.row.subs" border>
                    <el-table-column
                      v-for="column in subTableColumns"
                      :key="column.prop"
                      :prop="column.prop"
                      :label="column.label"
                      :width="column.width"
                    >
                      <template #default="subScope">
                        <span v-if="column.prop === 'subName'">
                          {{ locale === 'zh-TW' ? subScope.row.subName : subScope.row.subEngName }}
                        </span>
                        <span v-else>
                          {{ subScope.row[column.prop] }}
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in comTableColumns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
            >
              <template #default="comScope">
                <span v-if="column.prop === 'comName'">
                  {{ locale === 'zh-TW' ? comScope.row.comStName : comScope.row.comEngName }}
                </span>
                <span v-else>
                  {{ comScope.row[column.prop] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="showActionsColumn" :label="t('subList.actions')" width="240">
              <template #default="scope">
                <el-button type="warning" v-if="canChangePassword" @click.stop="handleChangePassword(scope.row)">
                  {{ t('subList.changePwd') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-for="column in groupTableColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
    />
    <el-table-column v-if="showActionsColumn" :label="t('subList.actions')" width="240">
      <template #default="scope">
        <el-button v-if="canCreateSubscription" @click.stop="openAddCompanyDialog(scope.row)">
          {{ t('subList.add') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<style scoped lang="scss">
.sub-list-container {
  .header-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}

.details-wrapper {
  padding: 10px 20px 10px 48px;
  background-color: #f5f7fa;
}
</style>