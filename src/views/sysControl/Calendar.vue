<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/stores/oms/auths';
import CalEvents from '@/components/sysControl/CalEvents.vue';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();

const canAddEvent = computed(() => {
  return userInfoStore.per1000.includes('sys-004-1000');
});

const canRefreshHoliday = computed(() => {
  return userInfoStore.per1000.includes('sys-004-1000') && userInfoStore.per0010.includes('sys-004-0010');
});

const addEvent = () => {
  console.log('新增事件');
};

const refreshHoliday = () => {
  console.log('更新假日');
};
</script>

<template>
  <div class="calendar-view-container">
    <div class="actions-bar">
      <el-button v-if="canAddEvent" type="primary" @click="addEvent">{{ t('calendar.addEvent') }}</el-button>
      <div class="spacer"></div>
      <el-button v-if="canRefreshHoliday" type="info" @click="refreshHoliday">{{ t('calendar.refreshHoliday') }}</el-button>
    </div>
    <cal-events />
  </div>
</template>

<style scoped lang="scss">
.calendar-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.spacer {
  flex-grow: 1;
}
</style>