<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSubItemsStore } from '@/stores/oms/orgs'
import { getAllGroupSubs } from '@/services/oms/orgs'
import type { GroupCompanies, ComSubs } from '@/interfaces'

const { t, locale } = useI18n()

const subItemsStore = useSubItemsStore()
const { groupSubs } = storeToRefs(subItemsStore)

const loading = ref(false)
const expandedGroupRowKeys = ref<string[]>([])
const expandedComRowKeys = ref<string[]>([])

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
const loadData = async () => {
  if (groupSubs.value.length > 0) return
  loading.value = true
  await getAllGroupSubs()
  loading.value = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
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
  </el-table>
</template>

<style scoped lang="scss">
.details-wrapper {
  padding: 10px 20px 10px 48px;
  background-color: #f5f7fa;
}
</style>