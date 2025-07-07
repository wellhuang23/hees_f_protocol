<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOmsServerLogs } from '@/services'
import { ElNotification } from 'element-plus'

const { t } = useI18n()

const selectedModule = ref('OMS')
const startTime = ref<string | null>(null)
const endTime = ref<string | null>(null)

const handleSearch = async () => {
  let getLogsErrno = '99999'
  if (selectedModule.value === 'OMS') {
    getLogsErrno = await getOmsServerLogs({
      logStartTime: startTime.value as string,
      logEndTime: endTime.value as string,
    })
  }

  if (getLogsErrno === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.getSysLogsSuccessMsg'),
      type: 'success'
    })
  } else if (['99001', '99002', '99003'].includes(getLogsErrno)) {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.getSysLogsTimeErrorMsg'),
      type: 'error'
    })
  } else if (getLogsErrno === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.getSysLogsPerErrorMsg'),
      type: 'error'
    })
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.getSysLogsErrorMsg'),
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="filter-section">
    <div class="filter-item">
      <label>{{ t('sysLogs.system') }}:</label>
      <el-select v-model="selectedModule" placeholder="Select" style="width: 250px;">
        <el-option :label="t('sysLogs.orgManage')" value="OMS" />
      </el-select>
    </div>

    <div class="filter-item">
      <label>{{ t('sysLogs.startTime') }}:</label>
      <el-date-picker
        v-model="startTime"
        type="datetime"
        placeholder="Select date and time"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </div>

    <div class="filter-item">
      <label>{{ t('sysLogs.endTime') }}:</label>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        placeholder="Select date and time"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </div>

    <el-button type="primary" @click="handleSearch">{{ t('sysLogs.searchButton') }}</el-button>
  </div>
</template>

<style scoped lang="scss">
.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-end;

  .filter-item {
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 5px;
      font-weight: bold;
    }
  }
}
</style>