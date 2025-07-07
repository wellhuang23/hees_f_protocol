<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmsServerLogsStore } from '@/stores/oms/bases'
import type { LogInfo } from '@/interfaces'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const omsServerLogsStore = useOmsServerLogsStore()
const { omsServerLogs } = storeToRefs(omsServerLogsStore)

const expandedRowKeys = ref<number[]>([])
const currentPage = ref(1)
const pageSize = ref(12)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return omsServerLogs.value.slice(start, end)
})

const totalLogs = computed(() => omsServerLogs.value.length)

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const getRowKey = (row: LogInfo) => {
  return row.logId
}

const handleRowClick = (row: LogInfo) => {
  const rowKey = getRowKey(row)
  if (expandedRowKeys.value.includes(rowKey)) {
    expandedRowKeys.value = []
  } else {
    expandedRowKeys.value = [rowKey]
  }
}

const formatException = (exception: string) => {
  return exception.replace(/\n/g, '<br>')
}

const mainTableColumns = computed(() => {
  return [
    { prop: 'level', label: t('sysLogs.level'), width: '100' },
    { prop: 'errno', label: t('sysLogs.errorNo'), width: '120' },
    { prop: 'apiMethod', label: t('sysLogs.apiMethod'), width: '120' },
    { prop: 'apiPath', label: t('sysLogs.apiPath'), width: '250' },
    { prop: 'opeUserStName', label: t('sysLogs.operator') },
    { prop: 'startTime', label: t('sysLogs.startTime') }
  ]
})

const executionsTableColumns = computed(() => {
  return [
    { prop: 'errno', label: t('sysLogs.errorNo'), width: '120' },
    { prop: 'status', label: t('sysLogs.status'), width: '100' },
    { prop: 'func', label: t('sysLogs.function'), width: '200' },
    { prop: 'desc', label: t('sysLogs.desc'), width: '300' },
    { prop: '_model', label: t('sysLogs.model') }
  ]
})
</script>

<template>
  <el-table
    :data="paginatedLogs"
    stripe
    style="width: 100%"
    :row-key="getRowKey"
    :expand-row-keys="expandedRowKeys"
    @row-click="handleRowClick"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div class="log-details">
          <p><strong>{{ t('sysLogs.desc') }}:</strong> {{ props.row.desc }}</p>
          <p><strong>{{ t('sysLogs.startTime') }}:</strong> {{ props.row.startTime }}</p>
          <p><strong>{{ t('sysLogs.endTime') }}:</strong> {{ props.row.endTime }}</p>
          <p><strong>{{ t('sysLogs.executionTime') }}:</strong> {{ props.row.durationTime }}</p>
          <p><strong>{{ t('sysLogs.operatorType') }}:</strong> {{ props.row.opeUserTypeName }}</p>
          <p><strong>{{ t('sysLogs.company') }}:</strong> {{ props.row.opeUserComStName }}</p>
          <p><strong>{{ t('sysLogs.group') }}:</strong> {{ props.row.opeUserGroupName }}</p>
          <el-table :data="props.row.executions" border class="executions-table">
            <el-table-column
              v-for="column in executionsTableColumns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
            />
          </el-table>
          <div v-if="props.row.exception" class="exception-details">
            <h4>{{ t('sysLogs.exception') }}</h4>
            <pre v-html="formatException(props.row.exception)"></pre>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-for="column in mainTableColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
    />
  </el-table>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="totalLogs"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss">
.log-details {
  padding: 10px 20px 10px 48px;
  background-color: #f5f7fa;
  p {
    margin: 5px 0;
  }
}
.executions-table {
  margin-top: 10px;
}
.exception-details {
  margin-top: 10px;
  h4 {
    margin-bottom: 5px;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #eef1f6;
    padding: 10px;
    border-radius: 4px;
  }
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>