<script setup lang="ts">
import type { UserJobPosition, UserStrUnit } from '@/interfaces'
import {useI18n} from 'vue-i18n'

const { t, locale } = useI18n();

const props = defineProps({
  strUnits: {
    type: Array as () => UserStrUnit[] | null,
    require: true
  },
  jobPositions: {
    type: Array as () => UserJobPosition[] | null,
    require: true
  }
})

const strUnitName = (row: UserStrUnit) => {
  return locale.value === 'zh-TW' ? row.strUnitName : row.strUnitEngName
}

const jobPositionName = (row: UserJobPosition) => {
  return locale.value === 'zh-TW' ? row.jobPosName : row.jobPosEngName
}
</script>

<template>
  <div class="str-units-container">
    <h3>{{ t('profile.org.strUnitTitle') }}</h3>
    <el-table :data="props.strUnits" stripe style="width: 100%">
      <el-table-column prop="strUnitNo" :label="t('profile.org.strUnitColNo')" width="200px" />
      <el-table-column :label="t('profile.org.strUnitColName')" width="300px" >
        <template #default="scope">
          <p>{{ strUnitName(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="strUnitDesc" :label="t('profile.org.strUnitColDesc')" />
    </el-table>
  </div>
  <div class="job-positions-container">
    <h3>{{ t('profile.org.jobPosTitle') }}</h3>
    <el-table :data="props.jobPositions" stripe style="width: 100%">
      <el-table-column prop="jobPosLevel" :label="t('profile.org.jobPosLevel')" width="200px" />
      <el-table-column :label="t('profile.org.jobPosName')" width="300px" >
        <template #default="scope">
          <p>{{ jobPositionName(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="jobPosDesc" :label="t('profile.org.jobPosDesc')" />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.str-units-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Do not shrink */
  width: 100%;
  height: 40vh;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.job-positions-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Do not shrink */
  width: 100%;
  height: 40vh;
  box-sizing: border-box;
}
</style>