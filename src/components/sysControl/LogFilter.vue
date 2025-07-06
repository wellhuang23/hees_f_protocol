<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOmsServerLogs } from '@/services'

const { t } = useI18n()

const selectedModule = ref('OMS')
const startTime = ref<string | null>(null)
const endTime = ref<string | null>(null)

const handleSearch = async () => {
  if (selectedModule.value === 'OMS') {
    await getOmsServerLogs({
      logStartTime: startTime.value as string,
      logEndTime: endTime.value as string,
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